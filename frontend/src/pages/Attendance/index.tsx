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
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  employeeService,
  type Attendance,
  type AttendancePayload,
  type AttendanceStatus,
  type Employee,
} from "../../services/employeeService";
import { toastifyService } from "../../services/toastifyService";
import { MainLayout } from "../../components/MainLayout";
import { FormActions } from "../../components/FormActions";
import {
  toDateInput,
  toTimeInput,
  formatDate,
  getEmployeeName,
  nullableText,
} from "../../utils/workforce";
import { emptyAttendanceForm, type AttendanceFormState, type AttendancePageProps, type DialogState } from "./types";
import { attendanceStatusLabels } from "./constants";
import { AttendanceTable } from "./component";



export function AttendancePage({ onLogout, onPageChange }: AttendancePageProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [form, setForm] = useState<AttendanceFormState>(emptyAttendanceForm());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [attendanceData, employeesData] = await Promise.all([
        employeeService.getAllAttendance(),
        employeeService.getAllEmployees(),
      ]);
      setAttendance(attendanceData);
      setEmployees(employeesData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load attendance data";
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
    setForm(emptyAttendanceForm());
    setDialog({ mode: "create" });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
    }
  };

  const openEdit = (record: Attendance) => {
    setForm({
      employeeId: record.employee.id,
      date: toDateInput(record.date),
      checkIn: toTimeInput(record.checkIn),
      checkOut: toTimeInput(record.checkOut),
      status: record.status,
    });
    setDialog({ mode: "edit", id: record.id });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: AttendancePayload = {
      employeeId: form.employeeId,
      date: form.date,
      checkIn: nullableText(form.checkIn),
      checkOut: nullableText(form.checkOut),
      status: form.status,
    };

    try {
      if (dialog?.mode === "edit" && dialog.id) {
        await employeeService.updateAttendance(dialog.id, payload);
        toastifyService.updateSuccess("Attendance");
      } else {
        await employeeService.createAttendance(payload);
        toastifyService.createSuccess("Attendance");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (record: Attendance) => {
    if (
      !window.confirm(
        `Delete attendance for ${getEmployeeName(record.employee)} on ${formatDate(
          record.date,
        )}?`,
      )
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await employeeService.deleteAttendance(record.id);
      toastifyService.deleteSuccess("Attendance");
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout 
      activeTab="attendance" 
      onTabChange={(tab) => onPageChange?.(tab)} 
      onLogout={onLogout}
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <Stack>
            <Typography variant="h4" component="h1" fontWeight={700} sx={{ color: '#1a1f2e' }}>
              Attendance
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
              Track employee attendance records
            </Typography>
          </Stack>

          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => void loadData()}
                disabled={isLoading || isSaving}
                aria-label="Refresh"
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {loadError && (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>
            {loadError}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isSaving}
          sx={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3d92 100%)',
            },
          }}
        >
          New Attendance
        </Button>

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
                borderRadius: '12px',
              }}
            >
              <CircularProgress />
            </Stack>
          )}

          <AttendanceTable
            attendance={attendance}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Stack>

      <Dialog
        open={dialog !== null}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit" ? "Edit attendance" : "New attendance"}
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
                select
                label="Employee"
                value={form.employeeId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    employeeId: event.target.value,
                  }))
                }
                required
                fullWidth
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {getEmployeeName(employee)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as AttendanceStatus,
                  }))
                }
                fullWidth
              >
                {Object.entries(attendanceStatusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Date"
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Check In"
                type="time"
                value={form.checkIn}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    checkIn: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Check Out"
                type="time"
                value={form.checkOut}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    checkOut: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>
    </MainLayout>
  );
}
