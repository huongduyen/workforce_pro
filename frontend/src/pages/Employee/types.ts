import type { ReactNode } from "react";
import type { Employee } from "../../services/employeeService";

export type TabKey = "employees" | "departments" | "attendance" | "leave";

export type StatusChipColor =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";

// Employee-specific types
export interface DialogState {
  type: TabKey;
  mode: "create" | "edit";
  id?: string;
}

export interface EmployeeFormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  hireDate: string;
  salary: string;
  position: string;
  departmentId: string;
}

export interface EmployeePageProps {
  onLogout: () => void;
  onPageChange?: (page: TabKey) => void;
}

export interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

// Shared UI component types
export interface TableShellProps {
  children: ReactNode;
}

export interface EmptyRowProps {
  colSpan: number;
  label: string;
}

export interface ActionCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

export interface FormActionsProps {
  isSaving: boolean;
  onClose: () => void;
}
