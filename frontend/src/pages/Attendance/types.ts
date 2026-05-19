import type { Attendance, AttendanceStatus } from "../../services/employeeService";
import type { TabKey } from "../../types/navigation";

export interface DialogState {
  mode: "create" | "edit";
  id?: string;
}

export interface AttendanceFormState {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
}

export const emptyAttendanceForm = (): AttendanceFormState => ({
  employeeId: "",
  date: "",
  checkIn: "",
  checkOut: "",
  status: "present",
});

export interface AttendanceTableProps {
  attendance: Attendance[];
  onEdit: (record: Attendance) => void;
  onDelete: (record: Attendance) => void;
}

export interface AttendancePageProps {
  onLogout: () => void;
  onPageChange?: (page: TabKey) => void;
}
