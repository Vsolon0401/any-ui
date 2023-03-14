import BaseCheckbox from "./checkbox";
import CheckboxGroup from "./group";
import { CheckboxProps } from "./interface";
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxOption,
} from "./interface";

type InternalCheckboxType = typeof BaseCheckbox;
interface CheckboxInterface extends InternalCheckboxType {
  Group: typeof CheckboxGroup;
}

const Checkbox = BaseCheckbox as CheckboxInterface;
Checkbox.Group = CheckboxGroup;

if (process.env.NODE_ENV !== "production") {
  Checkbox.displayName = "Checkbox";
}

export default Checkbox;
