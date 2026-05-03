import styled from "styled-components";
import {
  isThemeMode,
  useThemeMode,
  type ThemeMode
} from "../../../app/providers/theme";

const options: Array<{ value: ThemeMode; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeModeToggle() {
  const { mode, setMode } = useThemeMode();

  function handleSelectChange(value: string) {
    if (!isThemeMode(value)) {
      throw new Error(`Unexpected theme mode value: ${value}`);
    }

    setMode(value);
  }

  return (
    <ToggleGroup
      aria-label="Theme mode"
      role="group"
      title="Choose theme mode. Auto follows system settings, Light and Dark override it."
    >
      {options.map((option) => {
        const isSelected = mode === option.value;

        return (
          <ToggleButton
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            $selected={isSelected}
            onClick={() => setMode(option.value)}
          >
            {option.label}
          </ToggleButton>
        );
      })}
      <HiddenSelect
        aria-label="Theme mode"
        value={mode}
        onChange={(event) => handleSelectChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </HiddenSelect>
    </ToggleGroup>
  );
}

const ToggleGroup = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.controlGap};
  padding: ${({ theme }) => theme.spacing.controlGap};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.control};
  background: ${({ theme }) => theme.colors.surface};
`;

const ToggleButton = styled.button<{ $selected: boolean }>`
  border: 0;
  border-radius: ${({ theme }) => theme.radius.control};
  padding: ${({ theme }) => theme.spacing.togglePaddingY}
    ${({ theme }) => theme.spacing.togglePaddingX};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : "transparent"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.onAccent : theme.colors.text};
  font-size: ${({ theme }) => theme.typography.controlSize};
  line-height: 1;
  cursor: pointer;
`;

const HiddenSelect = styled.select`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;
