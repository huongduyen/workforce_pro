import type { ChipProps } from "@mui/material";
import type { LeaveStatus, LeaveType } from "../../services/employeeService";

type StatusChipColor = ChipProps["color"];

export const leaveTypeLabels: Record<LeaveType, string> = {
  sick_leave: "Sick",
  vacation_leave: "Vacation",
  personal_leave: "Personal",
  maternity_leave: "Maternity",
  paternity_leave: "Paternity",
};

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const leaveStatusColors: Record<LeaveStatus, StatusChipColor> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  cancelled: "default",
};
