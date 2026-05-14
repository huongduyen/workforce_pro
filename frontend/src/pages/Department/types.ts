import type { Department } from "../../services/employeeService";

export interface DialogState {
  mode: "create" | "edit";
  id?: string;
}

export interface DepartmentFormState {
  name: string;
  description: string;
}

export const emptyDepartmentForm = (): DepartmentFormState => ({
  name: "",
  description: "",
});

export interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export interface DepartmentPageProps {
  onLogout: () => void;
  onPageChange?: (page: "employees" | "departments" | "attendance" | "leave") => void;
}
