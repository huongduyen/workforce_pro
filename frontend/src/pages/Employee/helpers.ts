import type {
  EmployeeFormState,
} from "./types";
import { todayInput } from "../../utils/workforce";

export const emptyEmployeeForm = (): EmployeeFormState => ({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dateOfBirth: "",
  hireDate: todayInput(),
  salary: "",
  position: "",
  departmentId: "",
});
