import type { ChipProps } from "@mui/material";
import type { AttendanceStatus } from "../../services/employeeService";

type StatusChipColor = ChipProps["color"];

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
