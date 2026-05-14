import {Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { DepartmentTableProps } from "./types";
import { ActionCell, EmptyRow, TableShell } from "../Employee/components";

export function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  return (
    <TableShell>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Employees</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.length === 0 && (
            <EmptyRow colSpan={4} label="No departments" />
          )}
          {departments.map((department) => (
            <TableRow key={department.id} hover>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description || "-"}</TableCell>
              <TableCell align="right">
                {department.employees?.length ?? 0}
              </TableCell>
              <ActionCell
                onEdit={() => onEdit(department)}
                onDelete={() => onDelete(department)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
}