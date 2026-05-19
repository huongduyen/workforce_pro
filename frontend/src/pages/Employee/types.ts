import type { Employee } from "../../services/employeeService";
import type { TabKey } from "../../types/navigation";

// Employee-specific types
export interface DialogState {
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
