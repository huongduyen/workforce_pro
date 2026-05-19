import { useCallback, useEffect, useState, type FormEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { MainLayout } from "../../components/MainLayout";
import { FormActions } from "../../components/FormActions";
import {
  employeeService,
  type Department,
  type Employee,
  type EmployeePayload,
} from "../../services/employeeService";
import { toastifyService } from "../../services/toastifyService";
import {
  getEmployeeName,
  nullableText,
  toDateInput,
} from "../../utils/workforce";
import { EmployeeTable } from "./components";
import { emptyEmployeeForm } from "./helpers";
import type {
  DialogState,
  EmployeeFormState,
  EmployeePageProps,
} from "./types";

export function EmployeePage({ onLogout, onPageChange }: EmployeePageProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [form, setForm] = useState<EmployeeFormState>(emptyEmployeeForm());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAllEmployees(),
        employeeService.getAllDepartments(),
      ]);

      setEmployees(employeeData);
      setDepartments(departmentData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load employees";
      setLoadError(message);
      toastifyService.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreateDialog = () => {
    setForm(emptyEmployeeForm());
    setDialog({ mode: "create" });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
    }
  };

  const openEdit = (employee: Employee) => {
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber ?? "",
      dateOfBirth: toDateInput(employee.dateOfBirth),
      hireDate: toDateInput(employee.hireDate),
      salary: String(employee.salary ?? ""),
      position: employee.position ?? "",
      departmentId: employee.department?.id ?? "",
    });
    setDialog({ mode: "edit", id: employee.id });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: EmployeePayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phoneNumber: nullableText(form.phoneNumber),
      dateOfBirth: form.dateOfBirth,
      hireDate: form.hireDate,
      salary: Number(form.salary),
      position: nullableText(form.position),
      departmentId: form.departmentId || null,
    };

    try {
      if (dialog?.mode === "edit" && dialog.id) {
        await employeeService.updateEmployee(dialog.id, payload);
        toastifyService.updateSuccess("Employee");
      } else {
        await employeeService.createEmployee(payload);
        toastifyService.createSuccess("Employee");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete ${getEmployeeName(employee)}?`)) {
      return;
    }

    setIsSaving(true);

    try {
      await employeeService.deleteEmployee(employee.id);
      toastifyService.deleteSuccess("Employee");
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout
      activeTab="employees"
      onTabChange={(tab) => onPageChange?.(tab)}
      onLogout={onLogout}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{ color: "#1a1f2e" }}
          >
            Employees
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
            Manage your workforce data
          </Typography>
        </Stack>

        <Tooltip title="Refresh">
          <span>
            <IconButton
              onClick={() => void loadData()}
              disabled={isLoading || isSaving}
              aria-label="Refresh"
              sx={{
                bgcolor: "rgba(102, 126, 234, 0.1)",
                color: "#667eea",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.2)",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
          {loadError}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: "12px",
          mb: 3,
          overflow: "hidden",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          p: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isSaving}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #6a3d92 100%)",
            },
          }}
        >
          Add Employee
        </Button>
      </Paper>

      <Box sx={{ position: "relative" }}>
        {isLoading && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              bgcolor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "12px",
            }}
          >
            <CircularProgress />
          </Stack>
        )}

        <EmployeeTable
          employees={employees}
          onEdit={openEdit}
          onDelete={(employee) => void handleDelete(employee)}
        />
      </Box>

      <Dialog open={dialog !== null} onClose={closeDialog} fullWidth maxWidth="md">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit" ? "Edit employee" : "New employee"}
          </DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                pt: 1,
              }}
            >
              <TextField
                label="First name"
                value={form.firstName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    firstName: event.target.value,
                  }))
                }
                required
              />
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    lastName: event.target.value,
                  }))
                }
                required
              />
              <TextField
                label="Phone"
                value={form.phoneNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    phoneNumber: event.target.value,
                  }))
                }
              />
              <TextField
                select
                label="Department"
                value={form.departmentId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    departmentId: event.target.value,
                  }))
                }
              >
                <MenuItem value="">None</MenuItem>
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Position"
                value={form.position}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    position: event.target.value,
                  }))
                }
              />
              <TextField
                label="Date of birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    dateOfBirth: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Hire date"
                type="date"
                value={form.hireDate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hireDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Salary"
                type="number"
                value={form.salary}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    salary: event.target.value,
                  }))
                }
                inputProps={{ min: 0, step: "0.01" }}
                required
              />
            </Box>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>
    </MainLayout>
  );
}
