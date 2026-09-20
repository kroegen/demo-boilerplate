export type SelectValue = string | number;

export interface SelectOption {
  value: SelectValue;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue: SelectValue;
  options: SelectOption[];
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}
