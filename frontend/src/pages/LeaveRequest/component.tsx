import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { LeaveRequestTableProps } from "./types";
import { ActionCell, EmptyRow, TableShell } from "../Employee/components";
import { formatDate, getEmployeeName } from "../Employee/helpers";
import { leaveStatusColors, leaveStatusLabels, leaveTypeLabels } from "./constants";

export function LeaveRequestTable({
  leaveRequests,
  onEdit,
  onDelete,
}: LeaveRequestTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRequests.length === 0 && (
            <EmptyRow colSpan={6} label="No leave requests" />
          )}
          {leaveRequests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>{getEmployeeName(request.employee)}</TableCell>
              <TableCell>{leaveTypeLabels[request.type]}</TableCell>
              <TableCell>
                {formatDate(request.startDate)} to {formatDate(request.endDate)}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={leaveStatusLabels[request.status]}
                  color={leaveStatusColors[request.status]}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <ActionCell
                onEdit={() => onEdit(request)}
                onDelete={() => onDelete(request)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}