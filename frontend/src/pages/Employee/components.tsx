import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  CircularProgress,
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import {
  formatDate,
  formatMoney,
  getEmployeeName,
} from "./helpers";
import type {
  ActionCellProps,
  EmployeeTableProps,
  EmptyRowProps,
  FormActionsProps,
  TableShellProps,
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

export function TableShell({ children }: TableShellProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 1, borderColor: "#dde4ee" }}
    >
      {children}
    </TableContainer>
  );
}

export function EmptyRow({ colSpan, label }: EmptyRowProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        align="center"
        sx={{ py: 5, color: "#64748b" }}
      >
        {label}
      </TableCell>
    </TableRow>
  );
}

export function ActionCell({ onEdit, onDelete }: ActionCellProps) {
  return (
    <TableCell align="right">
      <Tooltip title="Edit">
        <IconButton onClick={onEdit} aria-label="Edit" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete} aria-label="Delete" size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export function FormActions({ isSaving, onClose }: FormActionsProps) {
  return (
    <DialogActions>
      <Button
        type="button"
        startIcon={<CloseIcon />}
        onClick={onClose}
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        startIcon={isSaving ? <CircularProgress size={18} /> : <SaveIcon />}
        disabled={isSaving}
      >
        Save
      </Button>
    </DialogActions>
  );
}
