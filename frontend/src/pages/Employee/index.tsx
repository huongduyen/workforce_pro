import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
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

type TabKey = "employees" | "departments" | "attendance" | "leave";
type DialogMode = "create" | "edit";

interface DialogState {
  type: TabKey;
  mode: DialogMode;
  id?: string;
}

interface EmployeeFormState {
  employeeId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  hireDate: string;
  salary: string;
  position: string;
  departmentId: string;
}

interface DepartmentFormState {
  name: string;
  description: string;
}

interface AttendanceFormState {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
}

interface LeaveRequestFormState {
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

const tabs: Array<{ key: TabKey; label: string; createLabel: string }> = [
  { key: "employees", label: "Employees", createLabel: "New employee" },
  { key: "departments", label: "Departments", createLabel: "New department" },
  { key: "attendance", label: "Attendance", createLabel: "New attendance" },
  { key: "leave", label: "Leave Requests", createLabel: "New leave request" },
];

const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half day",
};

const attendanceStatusColors: Record<
  AttendanceStatus,
  "default" | "success" | "warning" | "error" | "info"
> = {
  present: "success",
  absent: "error",
  late: "warning",
  half_day: "info",
};

const leaveTypeLabels: Record<LeaveType, string> = {
  sick_leave: "Sick",
  vacation_leave: "Vacation",
  personal_leave: "Personal",
  maternity_leave: "Maternity",
  paternity_leave: "Paternity",
};

const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const leaveStatusColors: Record<
  LeaveStatus,
  "default" | "success" | "warning" | "error" | "info"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  cancelled: "default",
};

const todayInput = () => new Date().toISOString().slice(0, 10);

const emptyEmployeeForm = (): EmployeeFormState => ({
  employeeId: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  dateOfBirth: "",
  hireDate: todayInput(),
  salary: "",
  position: "",
  departmentId: "",
});

const emptyDepartmentForm = (): DepartmentFormState => ({
  name: "",
  description: "",
});

const emptyAttendanceForm = (): AttendanceFormState => ({
  employeeId: "",
  date: todayInput(),
  checkIn: "",
  checkOut: "",
  status: "present",
});

const emptyLeaveRequestForm = (): LeaveRequestFormState => ({
  employeeId: "",
  type: "sick_leave",
  startDate: todayInput(),
  endDate: todayInput(),
  reason: "",
  status: "pending",
});

export function EmployeePage({ onLogout }: { onLogout: () => void }) {
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

  const activeTabConfig = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) ?? tabs[0],
    [activeTab],
  );

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
      employeeId: employee.employeeId,
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
      employeeId: employeeForm.employeeId.trim(),
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb", p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" component="h1" fontWeight={700}>
          Workforce
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Refresh">
            <span>
              <IconButton
                onClick={() => void loadData()}
                disabled={isLoading || isSaving}
                aria-label="Refresh"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={onLogout} aria-label="Logout">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 1,
          mb: 2,
          overflow: "hidden",
          borderColor: "#dde4ee",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={1}
          sx={{ px: 2, py: 1 }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value: TabKey) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab key={tab.key} value={tab.key} label={tab.label} />
            ))}
          </Tabs>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={isSaving}
            sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
          >
            {activeTabConfig.createLabel}
          </Button>
        </Stack>
      </Paper>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <Box sx={{ position: "relative" }}>
        {isLoading && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              bgcolor: "rgba(246, 248, 251, 0.65)",
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
                label="Employee ID"
                value={employeeForm.employeeId}
                onChange={(event) =>
                  setEmployeeForm((form) => ({
                    ...form,
                    employeeId: event.target.value,
                  }))
                }
                required
              />
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
    </Box>
  );
}

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
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
          {employees.length === 0 && <EmptyRow colSpan={7} label="No employees" />}
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

function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}) {
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

function AttendanceTable({
  attendance,
  onEdit,
  onDelete,
}: {
  attendance: Attendance[];
  onEdit: (record: Attendance) => void;
  onDelete: (record: Attendance) => void;
}) {
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

function LeaveRequestTable({
  leaveRequests,
  onEdit,
  onDelete,
}: {
  leaveRequests: LeaveRequest[];
  onEdit: (request: LeaveRequest) => void;
  onDelete: (request: LeaveRequest) => void;
}) {
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

function TableShell({ children }: { children: ReactNode }) {
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

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 5, color: "#64748b" }}>
        {label}
      </TableCell>
    </TableRow>
  );
}

function ActionCell({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
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

function FormActions({
  isSaving,
  onClose,
}: {
  isSaving: boolean;
  onClose: () => void;
}) {
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

function getEmployeeName(employee?: Employee | null): string {
  if (!employee) {
    return "-";
  }

  return `${employee.firstName} ${employee.lastName}`.trim();
}

function nullableText(value: string): string | null {
  return value.trim() || null;
}

function toDateInput(value?: string | Date | null): string {
  return value ? String(value).slice(0, 10) : "";
}

function toTimeInput(value?: string | null): string {
  return value ? String(value).slice(0, 5) : "";
}

function formatDate(value?: string | Date | null): string {
  return toDateInput(value) || "-";
}

function formatMoney(value: number | string): string {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
