const PRAGUE_TIME_ZONE = "Europe/Prague";
const UPDATE_HOUR = 14;
const UPDATE_MINUTE = 30;
const BROWSER_CACHE_SECONDS = 300;
const STALE_WHILE_REVALIDATE_SECONDS = 60;
const SHORT_CACHE_MILLISECONDS = 5 * 60 * 1000;

type PragueDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
};

type RegisteredMediaWeekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

const publishedAtMonthNumbers: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const pragueDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PRAGUE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const publishedAtFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: PRAGUE_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function getPragueDateParts(date: Date): PragueDateParts {
  const parts = pragueDateFormatter.formatToParts(date);

  const part = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((item) => item.type === type)?.value;

    if (!value) {
      throw new Error(`Missing ${type} in Prague date formatter output`);
    }

    return value;
  };

  return {
    year: Number(part("year")),
    month: Number(part("month")),
    day: Number(part("day")),
    hour: Number(part("hour")),
    minute: Number(part("minute")),
    second: Number(part("second")),
    weekday: part("weekday"),
  };
}

function isWorkingDay(weekday: string): weekday is RegisteredMediaWeekday {
  return (
    weekday === "Mon" ||
    weekday === "Tue" ||
    weekday === "Wed" ||
    weekday === "Thu" ||
    weekday === "Fri"
  );
}

function getPragueUtcOffsetMilliseconds(date: Date) {
  const pragueDate = getPragueDateParts(date);

  return (
    Date.UTC(
      pragueDate.year,
      pragueDate.month - 1,
      pragueDate.day,
      pragueDate.hour,
      pragueDate.minute,
      pragueDate.second,
    ) - date.getTime()
  );
}

function createPragueDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const pragueOffset = getPragueUtcOffsetMilliseconds(utcGuess);

  return new Date(utcGuess.getTime() - pragueOffset);
}

function getNextWorkingDayPragueDate(now: Date) {
  const currentPragueDate = getPragueDateParts(now);

  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    const candidateDate = new Date(
      Date.UTC(
        currentPragueDate.year,
        currentPragueDate.month - 1,
        currentPragueDate.day + dayOffset,
        12,
        0,
        0,
      ),
    );
    const candidatePragueDate = getPragueDateParts(candidateDate);

    if (isWorkingDay(candidatePragueDate.weekday)) {
      return candidatePragueDate;
    }
  }

  throw new Error("Unable to determine next CNB working day");
}

function getPreviousWorkingDayPragueDate(now: Date) {
  const currentPragueDate = getPragueDateParts(now);

  for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
    const candidateDate = new Date(
      Date.UTC(
        currentPragueDate.year,
        currentPragueDate.month - 1,
        currentPragueDate.day - dayOffset,
        12,
        0,
        0,
      ),
    );
    const candidatePragueDate = getPragueDateParts(candidateDate);

    if (isWorkingDay(candidatePragueDate.weekday)) {
      return candidatePragueDate;
    }
  }

  throw new Error("Unable to determine previous CNB working day");
}

function getPragueCalendarDayValue(dateParts: Pick<PragueDateParts, "year" | "month" | "day">) {
  return dateParts.year * 10_000 + dateParts.month * 100 + dateParts.day;
}

function parsePublishedAtCalendarDayValue(publishedAt: string) {
  const match = publishedAt.match(/^(\d{2}) ([A-Za-z]{3}) (\d{4})$/);

  if (!match) {
    throw new Error("Unexpected rates publishedAt format");
  }

  const [, dayText, monthText, yearText] = match;
  const monthNumber = publishedAtMonthNumbers[monthText];

  if (!monthNumber) {
    throw new Error("Unexpected rates publishedAt month");
  }

  return Number(yearText) * 10_000 + monthNumber * 100 + Number(dayText);
}

function getExpectedPublishedDate(now = new Date()) {
  const currentPragueDate = getPragueDateParts(now);
  const todayRefresh = createPragueDate(
    currentPragueDate.year,
    currentPragueDate.month,
    currentPragueDate.day,
    UPDATE_HOUR,
    UPDATE_MINUTE,
  );

  if (
    isWorkingDay(currentPragueDate.weekday) &&
    now.getTime() >= todayRefresh.getTime()
  ) {
    return currentPragueDate;
  }

  return getPreviousWorkingDayPragueDate(now);
}

export function getExpectedRatesPublishedAt(now = new Date()) {
  const expectedPublishedDate = getExpectedPublishedDate(now);

  return publishedAtFormatter.format(
    createPragueDate(
      expectedPublishedDate.year,
      expectedPublishedDate.month,
      expectedPublishedDate.day,
      12,
      0,
      0,
    ),
  );
}

export function isRatesPublishedAtOlderThanExpected(
  publishedAt: string,
  now = new Date(),
) {
  return (
    parsePublishedAtCalendarDayValue(publishedAt) <
    getPragueCalendarDayValue(getExpectedPublishedDate(now))
  );
}

export function getNextRatesRefreshAt(now = new Date()) {
  const currentPragueDate = getPragueDateParts(now);
  const todayRefresh = createPragueDate(
    currentPragueDate.year,
    currentPragueDate.month,
    currentPragueDate.day,
    UPDATE_HOUR,
    UPDATE_MINUTE,
  );

  if (isWorkingDay(currentPragueDate.weekday) && now.getTime() < todayRefresh.getTime()) {
    return todayRefresh;
  }

  const nextWorkingDay = getNextWorkingDayPragueDate(now);

  return createPragueDate(
    nextWorkingDay.year,
    nextWorkingDay.month,
    nextWorkingDay.day,
    UPDATE_HOUR,
    UPDATE_MINUTE,
  );
}

export function getRatesCacheTtlMilliseconds(now = new Date()) {
  return Math.max(0, getNextRatesRefreshAt(now).getTime() - now.getTime());
}

export function getRatesCacheTtlSeconds(now = new Date()) {
  return Math.max(0, Math.ceil(getRatesCacheTtlMilliseconds(now) / 1000));
}

export function getRatesCacheExpiresAt(publishedAt: string, now = new Date()) {
  if (isRatesPublishedAtOlderThanExpected(publishedAt, now)) {
    return new Date(now.getTime() + SHORT_CACHE_MILLISECONDS);
  }

  return getNextRatesRefreshAt(now);
}

export function getRatesCacheTtlMillisecondsForPublishedAt(
  publishedAt: string,
  now = new Date(),
) {
  return Math.max(0, getRatesCacheExpiresAt(publishedAt, now).getTime() - now.getTime());
}

export function buildRatesCacheControlHeader(expiresAt: Date, now = new Date()) {
  const sharedCacheSeconds = Math.max(
    60,
    Math.ceil((expiresAt.getTime() - now.getTime()) / 1000),
  );

  return `public, max-age=${BROWSER_CACHE_SECONDS}, s-maxage=${sharedCacheSeconds}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;
}
