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
  type Employee,
  type LeaveRequest,
  type LeaveRequestPayload,
  type LeaveStatus,
  type LeaveType,
} from "../../services/employeeService";
import { toastifyService } from "../../services/toastifyService";
import { MainLayout } from "../../components/MainLayout";
import {  FormActions } from "../Employee/components";
import { toDateInput, getEmployeeName } from "../Employee/helpers";
import {
  emptyLeaveRequestForm,
  type DialogState,
  type LeaveRequestFormState,
  type LeaveRequestPageProps,
} from "./types";
import { leaveStatusLabels, leaveTypeLabels } from "./helpers";
import { LeaveRequestTable } from "./component";

export function LeaveRequestPage({
  onLogout,
  onPageChange,
}: LeaveRequestPageProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [form, setForm] = useState<LeaveRequestFormState>(
    emptyLeaveRequestForm(),
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [leaveData, employeesData] = await Promise.all([
        employeeService.getAllLeaveRequests(),
        employeeService.getAllEmployees(),
      ]);
      setLeaveRequests(leaveData);
      setEmployees(employeesData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load leave request data";
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
    setForm(emptyLeaveRequestForm());
    setDialog({ mode: "create" });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
    }
  };

  const openEdit = (request: LeaveRequest) => {
    setForm({
      employeeId: request.employee.id,
      type: request.type,
      startDate: toDateInput(request.startDate),
      endDate: toDateInput(request.endDate),
      reason: request.reason,
      status: request.status,
    });
    setDialog({ mode: "edit", id: request.id });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: LeaveRequestPayload = {
      employeeId: form.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim(),
      status: form.status,
    };

    try {
      if (dialog?.mode === "edit" && dialog.id) {
        await employeeService.updateLeaveRequest(dialog.id, payload);
        toastifyService.updateSuccess("Leave request");
      } else {
        await employeeService.createLeaveRequest(payload);
        toastifyService.createSuccess("Leave request");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (request: LeaveRequest) => {
    if (
      !window.confirm(
        `Delete leave request for ${getEmployeeName(request.employee)}?`,
      )
    ) {
      return;
    }

    setIsSaving(true);

    try {
      await employeeService.deleteLeaveRequest(request.id);
      toastifyService.deleteSuccess("Leave request");
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout
      activeTab="leave"
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
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              sx={{ color: "#1a1f2e" }}
            >
              Leave Requests
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
              Manage employee leave requests
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
          <Alert severity="error" sx={{ borderRadius: "12px" }}>
            {loadError}
          </Alert>
        )}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isSaving}
          sx={{
            alignSelf: "flex-start",
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
          New Leave Request
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
                borderRadius: "12px",
              }}
            >
              <CircularProgress />
            </Stack>
          )}

          <LeaveRequestTable
            leaveRequests={leaveRequests}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Stack>

      <Dialog
        open={dialog !== null}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit"
              ? "Edit leave request"
              : "New leave request"}
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
                label="Type"
                value={form.type}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    type: event.target.value as LeaveType,
                  }))
                }
                fullWidth
              >
                {Object.entries(leaveTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    startDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    endDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as LeaveStatus,
                  }))
                }
                fullWidth
              >
                {Object.entries(leaveStatusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Reason"
                value={form.reason}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    reason: event.target.value,
                  }))
                }
                multiline
                minRows={3}
                required
                sx={{ gridColumn: { sm: "1 / -1" } }}
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
