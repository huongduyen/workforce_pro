import type { LeaveRequest, LeaveStatus, LeaveType } from "../../services/employeeService";
import type { TabKey } from "../../types/navigation";

export interface DialogState {
  mode: "create" | "edit";
  id?: string;
}

export interface LeaveRequestFormState {
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export const emptyLeaveRequestForm = (): LeaveRequestFormState => ({
  employeeId: "",
  type: "vacation_leave",
  startDate: "",
  endDate: "",
  reason: "",
  status: "pending",
});

export interface LeaveRequestTableProps {
  leaveRequests: LeaveRequest[];
  onEdit: (request: LeaveRequest) => void;
  onDelete: (request: LeaveRequest) => void;
}

export interface LeaveRequestPageProps {
  onLogout: () => void;
  onPageChange?: (page: TabKey) => void;
}
