import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import type { ReactNode } from "react";

interface TableShellProps {
  children: ReactNode;
}

interface EmptyRowProps {
  colSpan: number;
  label: string;
}

interface ActionCellProps {
  onEdit: () => void;
  onDelete: () => void;
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
