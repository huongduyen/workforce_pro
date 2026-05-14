import {
  Chip,
 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { AttendanceTableProps } from "./types";
import { ActionCell, EmptyRow, TableShell } from "../Employee/components";
import { formatDate, getEmployeeName, toTimeInput } from "../Employee/helpers";
import { attendanceStatusColors, attendanceStatusLabels } from "./constants";
export function AttendanceTable({
  attendance,
  onEdit,
  onDelete,
}: AttendanceTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Check In</TableCell>
            <TableCell>Check Out</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.length === 0 && (
            <EmptyRow colSpan={6} label="No attendance records" />
          )}
          {attendance.map((record) => (
            <TableRow key={record.id} hover>
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>{getEmployeeName(record.employee)}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={attendanceStatusLabels[record.status]}
                  color={attendanceStatusColors[record.status]}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{toTimeInput(record.checkIn) || "-"}</TableCell>
              <TableCell>{toTimeInput(record.checkOut) || "-"}</TableCell>
              <ActionCell
                onEdit={() => onEdit(record)}
                onDelete={() => onDelete(record)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}