import type { Employee } from "../../services/employeeService";
import type {
  EmployeeFormState,
} from "./types";

export const todayInput = () => new Date().toISOString().slice(0, 10);

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

export function getEmployeeName(employee?: Employee | null): string {
  if (!employee) {
    return "-";
  }

  return `${employee.firstName} ${employee.lastName}`.trim();
}

export function nullableText(value: string): string | null {
  return value.trim() || null;
}

export function toDateInput(value?: string | Date | null): string {
  return value ? String(value).slice(0, 10) : "";
}

export function toTimeInput(value?: string | null): string {
  return value ? String(value).slice(0, 5) : "";
}

export function formatDate(value?: string | Date | null): string {
  return toDateInput(value) || "-";
}

export function formatMoney(value: number | string): string {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
