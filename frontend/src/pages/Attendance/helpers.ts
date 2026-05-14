import type { AttendanceStatus } from "../../services/employeeService";
import type { StatusChipColor } from "../Employee/types";

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half day",
};

export const attendanceStatusColors: Record<
  AttendanceStatus,
  StatusChipColor
> = {
  present: "success",
  absent: "error",
  late: "warning",
  half_day: "info",
};