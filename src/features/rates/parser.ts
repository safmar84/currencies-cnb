import { RatesSchema, type Rates } from "./types";

export function parseRates(data: string): Rates {
    const lines = data
        .split("\n")
        .map((line) => line.trim());
    
    const [dateLine, headerLine, ...rest] = lines;

    const dataLines: string[] = [];
    // pushing only lines until the first empty line, ignore the rest (fixes 1999-2001 CNB data historical format)
    for (const line of rest) {
        if (line === "") break;
        dataLines.push(line);
    }

    if (headerLine !== "Country|Currency|Amount|Code|Rate") {
        throw new Error("Unexpected CNB header line format");
    }

    if (!dateLine) {
        throw new Error("Missing CNB date line");
    }
    
    // This is how it is documented: "02.Jun.2024 #80", but in reality it is "02 Jun 2024 #80". 
    // const match = dateLine.match(/^(\d{2}\.[A-Za-z]{3}\.\d{4})\s+#(\d+)$/);
    const match = dateLine.match(/^(\d{2} [A-Za-z]{3} \d{4})\s+#(\d+)$/);

    if (!match) {
        throw new Error("Unexpected CNB date line format");
    }

    const rows = dataLines
        .filter((line) => line.includes("|"))
        .map((line) => {
            const parts = line.split("|").map((part) => part.trim());

            if (parts.length !== 5) {
                throw new Error(`Unexpected CNB data line format: ${line}`);
            }

            const [country, currency, amount, code, rate] = parts;

            return {
                country,
                currency,
                amount: Number(amount),
                code,
                rate: Number(rate),
            };
        });

    return RatesSchema.parse({
        publishedAt: match[1],
        sequence: Number(match[2]),
        rows,
    });
}