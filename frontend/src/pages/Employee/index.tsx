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
import {
  employeeService,
  type Attendance,
  type AttendancePayload,
  type AttendanceStatus,
  type Department,
  type DepartmentPayload,
  type Employee,
  type EmployeePayload,
  type LeaveRequest,
  type LeaveRequestPayload,
  type LeaveStatus,
  type LeaveType,
} from "../../services/employeeService";
import { toastifyService } from "../../services/toastifyService";
import { MainLayout } from "../../components/MainLayout";
import {
  EmployeeTable,
  FormActions,
} from "./components";

import {
  emptyEmployeeForm,
  formatDate,
  getEmployeeName,
  nullableText,
  toDateInput,
  toTimeInput,
} from "./helpers";
import type {
  DialogState,
  EmployeeFormState,
  EmployeePageProps,
  TabKey,
} from "./types";
import { DepartmentTable } from "../Department/component";
import { LeaveRequestTable } from "../LeaveRequest/component";
import { AttendanceTable } from "../Attendance/component";
import {
  emptyDepartmentForm,
  type DepartmentFormState,
} from "../Department/types";
import {
  emptyAttendanceForm,
  type AttendanceFormState,
} from "../Attendance/types";
import {
  emptyLeaveRequestForm,
  type LeaveRequestFormState,
} from "../LeaveRequest/types";
import { attendanceStatusLabels } from "../Attendance/helpers";
import { leaveStatusLabels, leaveTypeLabels } from "../LeaveRequest/helpers";

export function EmployeePage({ onLogout, onPageChange }: EmployeePageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [employeeForm, setEmployeeForm] = useState<EmployeeFormState>(
    emptyEmployeeForm,
  );
  const [departmentForm, setDepartmentForm] = useState<DepartmentFormState>(
    emptyDepartmentForm,
  );
  const [attendanceForm, setAttendanceForm] = useState<AttendanceFormState>(
    emptyAttendanceForm,
  );
  const [leaveRequestForm, setLeaveRequestForm] =
    useState<LeaveRequestFormState>(emptyLeaveRequestForm);



  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [employeeData, departmentData, attendanceData, leaveRequestData] =
        await Promise.all([
          employeeService.getAllEmployees(),
          employeeService.getAllDepartments(),
          employeeService.getAllAttendance(),
          employeeService.getAllLeaveRequests(),
        ]);

      setEmployees(employeeData);
      setDepartments(departmentData);
      setAttendance(attendanceData);
      setLeaveRequests(leaveRequestData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load workforce data";
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
    if (activeTab === "employees") {
      setEmployeeForm(emptyEmployeeForm());
    }

    if (activeTab === "departments") {
      setDepartmentForm(emptyDepartmentForm());
    }

    if (activeTab === "attendance") {
      setAttendanceForm(emptyAttendanceForm());
    }

    if (activeTab === "leave") {
      setLeaveRequestForm(emptyLeaveRequestForm());
    }

    setDialog({ type: activeTab, mode: "create" });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
    }
  };

  const openEmployeeEdit = (employee: Employee) => {
    setEmployeeForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      phoneNumber: employee.phoneNumber ?? "",
      dateOfBirth: toDateInput(employee.dateOfBirth),
      hireDate: toDateInput(employee.hireDate),
      salary: String(employee.salary ?? ""),
      position: employee.position ?? "",
      departmentId: employee.department?.id ?? "",
    });
    setDialog({ type: "employees", mode: "edit", id: employee.id });
  };

  const openDepartmentEdit = (department: Department) => {
    setDepartmentForm({
      name: department.name,
      description: department.description ?? "",
    });
    setDialog({ type: "departments", mode: "edit", id: department.id });
  };

  const openAttendanceEdit = (record: Attendance) => {
    setAttendanceForm({
      employeeId: record.employee.id,
      date: toDateInput(record.date),
      checkIn: toTimeInput(record.checkIn),
      checkOut: toTimeInput(record.checkOut),
      status: record.status,
    });
    setDialog({ type: "attendance", mode: "edit", id: record.id });
  };

  const openLeaveRequestEdit = (request: LeaveRequest) => {
    setLeaveRequestForm({
      employeeId: request.employee.id,
      type: request.type,
      startDate: toDateInput(request.startDate),
      endDate: toDateInput(request.endDate),
      reason: request.reason,
      status: request.status,
    });
    setDialog({ type: "leave", mode: "edit", id: request.id });
  };

  const handleEmployeeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: EmployeePayload = {
      firstName: employeeForm.firstName.trim(),
      lastName: employeeForm.lastName.trim(),
      phoneNumber: nullableText(employeeForm.phoneNumber),
      dateOfBirth: employeeForm.dateOfBirth,
      hireDate: employeeForm.hireDate,
      salary: Number(employeeForm.salary),
      position: nullableText(employeeForm.position),
      departmentId: employeeForm.departmentId || null,
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

  const handleDepartmentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: DepartmentPayload = {
      name: departmentForm.name.trim(),
      description: nullableText(departmentForm.description),
    };

    try {
      if (dialog?.mode === "edit" && dialog.id) {
        await employeeService.updateDepartment(dialog.id, payload);
        toastifyService.updateSuccess("Department");
      } else {
        await employeeService.createDepartment(payload);
        toastifyService.createSuccess("Department");
      }

      closeDialog();
      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttendanceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: AttendancePayload = {
      employeeId: attendanceForm.employeeId,
      date: attendanceForm.date,
      checkIn: nullableText(attendanceForm.checkIn),
      checkOut: nullableText(attendanceForm.checkOut),
      status: attendanceForm.status,
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

  const handleLeaveRequestSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSaving(true);

    const payload: LeaveRequestPayload = {
      employeeId: leaveRequestForm.employeeId,
      type: leaveRequestForm.type,
      startDate: leaveRequestForm.startDate,
      endDate: leaveRequestForm.endDate,
      reason: leaveRequestForm.reason.trim(),
      status: leaveRequestForm.status,
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

  const handleDelete = async (type: TabKey, id: string, label: string) => {
    if (!window.confirm(`Delete ${label}?`)) {
      return;
    }

    setIsSaving(true);

    try {
      if (type === "employees") {
        await employeeService.deleteEmployee(id);
        toastifyService.deleteSuccess("Employee");
      }

      if (type === "departments") {
        await employeeService.deleteDepartment(id);
        toastifyService.deleteSuccess("Department");
      }

      if (type === "attendance") {
        await employeeService.deleteAttendance(id);
        toastifyService.deleteSuccess("Attendance");
      }

      if (type === "leave") {
        await employeeService.deleteLeaveRequest(id);
        toastifyService.deleteSuccess("Leave request");
      }

      await loadData();
    } catch (error) {
      toastifyService.apiError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        onPageChange?.(tab);
      }}
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
          <Typography variant="h4" component="h1" fontWeight={700} sx={{ color: '#1a1f2e' }}>
            Employees
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
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
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {loadError}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          borderRadius: '12px',
          mb: 3,
          overflow: "hidden",
          border: '1px solid rgba(102, 126, 234, 0.2)',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          p: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          disabled={isSaving}
          sx={{
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
              borderRadius: '12px',
            }}
          >
            <CircularProgress />
          </Stack>
        )}

        {activeTab === "employees" && (
          <EmployeeTable
            employees={employees}
            onEdit={openEmployeeEdit}
            onDelete={(employee) =>
              void handleDelete(
                "employees",
                employee.id,
                getEmployeeName(employee),
              )
            }
          />
        )}

        {activeTab === "departments" && (
          <DepartmentTable
            departments={departments}
            onEdit={openDepartmentEdit}
            onDelete={(department) =>
              void handleDelete("departments", department.id, department.name)
            }
          />
        )}

        {activeTab === "attendance" && (
          <AttendanceTable
            attendance={attendance}
            onEdit={openAttendanceEdit}
            onDelete={(record) =>
              void handleDelete(
                "attendance",
                record.id,
                `${getEmployeeName(record.employee)} on ${formatDate(
                  record.date,
                )}`,
              )
            }
          />
        )}

        {activeTab === "leave" && (
          <LeaveRequestTable
            leaveRequests={leaveRequests}
            onEdit={openLeaveRequestEdit}
            onDelete={(request) =>
              void handleDelete(
                "leave",
                request.id,
                `${getEmployeeName(request.employee)} leave request`,
              )
            }
          />
        )}
      </Box>

      <Dialog
        open={dialog?.type === "employees"}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
      >
        <Box component="form" onSubmit={handleEmployeeSubmit}>
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
                value={employeeForm.firstName}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    firstName: event.target.value,
                  }))
                }
                required
              />
              <TextField
                label="Last name"
                value={employeeForm.lastName}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    lastName: event.target.value,
                  }))
                }
                required
              />
              <TextField
                label="Phone"
                value={employeeForm.phoneNumber}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    phoneNumber: event.target.value,
                  }))
                }
              />
              <TextField
                select
                label="Department"
                value={employeeForm.departmentId}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
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
                value={employeeForm.position}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    position: event.target.value,
                  }))
                }
              />
              <TextField
                label="Date of birth"
                type="date"
                value={employeeForm.dateOfBirth}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    dateOfBirth: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Hire date"
                type="date"
                value={employeeForm.hireDate}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    hireDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Salary"
                type="number"
                value={employeeForm.salary}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
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

      <Dialog
        open={dialog?.type === "departments"}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleDepartmentSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit" ? "Edit department" : "New department"}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Name"
                value={departmentForm.name}
                onChange={(event) =>
                  setDepartmentForm((form) => ({
                    ...form,
                    name: event.target.value,
                  }))
                }
                required
              />
              <TextField
                label="Description"
                value={departmentForm.description}
                onChange={(event) =>
                  setDepartmentForm((form) => ({
                    ...form,
                    description: event.target.value,
                  }))
                }
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>

      <Dialog
        open={dialog?.type === "attendance"}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleAttendanceSubmit}>
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
                value={attendanceForm.employeeId}
                onChange={(event) =>
                  setAttendanceForm((form) => ({
                    ...form,
                    employeeId: event.target.value,
                  }))
                }
                required
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
                value={attendanceForm.status}
                onChange={(event) =>
                  setAttendanceForm((form) => ({
                    ...form,
                    status: event.target.value as AttendanceStatus,
                  }))
                }
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
                value={attendanceForm.date}
                onChange={(event) =>
                  setAttendanceForm((form) => ({
                    ...form,
                    date: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="Check in"
                type="time"
                value={attendanceForm.checkIn}
                onChange={(event) =>
                  setAttendanceForm((form) => ({
                    ...form,
                    checkIn: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Check out"
                type="time"
                value={attendanceForm.checkOut}
                onChange={(event) =>
                  setAttendanceForm((form) => ({
                    ...form,
                    checkOut: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>

      <Dialog
        open={dialog?.type === "leave"}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
      >
        <Box component="form" onSubmit={handleLeaveRequestSubmit}>
          <DialogTitle>
            {dialog?.mode === "edit" ? "Edit leave request" : "New leave request"}
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
                value={leaveRequestForm.employeeId}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    employeeId: event.target.value,
                  }))
                }
                required
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
                value={leaveRequestForm.type}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    type: event.target.value as LeaveType,
                  }))
                }
              >
                {Object.entries(leaveTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Start date"
                type="date"
                value={leaveRequestForm.startDate}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    startDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="End date"
                type="date"
                value={leaveRequestForm.endDate}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    endDate: event.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                select
                label="Status"
                value={leaveRequestForm.status}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    status: event.target.value as LeaveStatus,
                  }))
                }
              >
                {Object.entries(leaveStatusLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Reason"
                value={leaveRequestForm.reason}
                onChange={(event) =>
                  setLeaveRequestForm((form) => ({
                    ...form,
                    reason: event.target.value,
                  }))
                }
                multiline
                minRows={3}
                required
                sx={{ gridColumn: { sm: "1 / -1" } }}
              />
            </Box>
          </DialogContent>
          <FormActions isSaving={isSaving} onClose={closeDialog} />
        </Box>
      </Dialog>
    </MainLayout>
  );
}
