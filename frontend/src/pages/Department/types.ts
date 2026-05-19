import type { Department } from "../../services/employeeService";
import type { TabKey } from "../../types/navigation";

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
  onPageChange?: (page: TabKey) => void;
}
