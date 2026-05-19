import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  formatDate,
  formatMoney,
  getEmployeeName,
} from "../../utils/workforce";
import { ActionCell, EmptyRow, TableShell } from "../../components/DataTable";
import type {
  EmployeeTableProps,
} from "./types";

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Hire Date</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.length === 0 && (
            <EmptyRow colSpan={7} label="No employees" />
          )}
          {employees.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{getEmployeeName(employee)}</TableCell>
              <TableCell>{employee.department?.name ?? "-"}</TableCell>
              <TableCell>{employee.position || "-"}</TableCell>
              <TableCell>{formatDate(employee.hireDate)}</TableCell>
              <TableCell align="right">{formatMoney(employee.salary)}</TableCell>
              <ActionCell
                onEdit={() => onEdit(employee)}
                onDelete={() => onDelete(employee)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}
