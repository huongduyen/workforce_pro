const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  employees?: Employee[];
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber?: string | null;
  dateOfBirth: string;
  hireDate: string;
  salary: number | string;
  position?: string | null;
  department?: Department | null;
  createdAt?: string;
  updatedAt?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "half_day";

export interface Attendance {
  id: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: AttendanceStatus;
  employee: Employee;
  createdAt?: string;
  updatedAt?: string;
}

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export type LeaveType =
  | "sick_leave"
  | "vacation_leave"
  | "personal_leave"
  | "maternity_leave"
  | "paternity_leave";

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  employee: Employee;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeePayload {
  firstName: string;
  lastName: string;
  employeeId: string;
  phoneNumber?: string | null;
  dateOfBirth: string;
  hireDate: string;
  salary: number;
  position?: string | null;
  departmentId?: string | null;
}

export interface DepartmentPayload {
  name: string;
  description?: string | null;
}

export interface AttendancePayload {
  employeeId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status?: AttendanceStatus;
}

export interface LeaveRequestPayload {
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status?: LeaveStatus;
}

class EmployeeService {
  private getHeaders() {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  getAllEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>("/employee");
  }

  getEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/employee/${id}`);
  }

  createEmployee(employeeData: EmployeePayload): Promise<Employee> {
    return this.request<Employee>("/employee", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
  }

  updateEmployee(
    id: string,
    employeeData: Partial<EmployeePayload>,
  ): Promise<Employee> {
    return this.request<Employee>(`/employee/${id}`, {
      method: "PATCH",
      body: JSON.stringify(employeeData),
    });
  }

  deleteEmployee(id: string): Promise<void> {
    return this.request<void>(`/employee/${id}`, { method: "DELETE" });
  }

  getAllDepartments(): Promise<Department[]> {
    return this.request<Department[]>("/department");
  }

  createDepartment(departmentData: DepartmentPayload): Promise<Department> {
    return this.request<Department>("/department", {
      method: "POST",
      body: JSON.stringify(departmentData),
    });
  }

  updateDepartment(
    id: string,
    departmentData: Partial<DepartmentPayload>,
  ): Promise<Department> {
    return this.request<Department>(`/department/${id}`, {
      method: "PATCH",
      body: JSON.stringify(departmentData),
    });
  }

  deleteDepartment(id: string): Promise<void> {
    return this.request<void>(`/department/${id}`, { method: "DELETE" });
  }

  getAllAttendance(): Promise<Attendance[]> {
    return this.request<Attendance[]>("/attendance");
  }

  createAttendance(attendanceData: AttendancePayload): Promise<Attendance> {
    return this.request<Attendance>("/attendance", {
      method: "POST",
      body: JSON.stringify(attendanceData),
    });
  }

  updateAttendance(
    id: string,
    attendanceData: Partial<AttendancePayload>,
  ): Promise<Attendance> {
    return this.request<Attendance>(`/attendance/${id}`, {
      method: "PATCH",
      body: JSON.stringify(attendanceData),
    });
  }

  deleteAttendance(id: string): Promise<void> {
    return this.request<void>(`/attendance/${id}`, { method: "DELETE" });
  }

  getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return this.request<LeaveRequest[]>("/leave-request");
  }

  createLeaveRequest(
    leaveRequestData: LeaveRequestPayload,
  ): Promise<LeaveRequest> {
    return this.request<LeaveRequest>("/leave-request", {
      method: "POST",
      body: JSON.stringify(leaveRequestData),
    });
  }

  updateLeaveRequest(
    id: string,
    leaveRequestData: Partial<LeaveRequestPayload>,
  ): Promise<LeaveRequest> {
    return this.request<LeaveRequest>(`/leave-request/${id}`, {
      method: "PATCH",
      body: JSON.stringify(leaveRequestData),
    });
  }

  deleteLeaveRequest(id: string): Promise<void> {
    return this.request<void>(`/leave-request/${id}`, { method: "DELETE" });
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const payload = await this.parseResponse(response);

    if (!response.ok) {
      throw new Error(this.getErrorMessage(payload, response.statusText));
    }

    return this.unwrapPayload<T>(payload);
  }

  private async parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) {
      return undefined;
    }

    const text = await response.text();

    if (!text) {
      return undefined;
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  private unwrapPayload<T>(payload: unknown): T {
    if (
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      (payload as { data: unknown }).data !== undefined
    ) {
      return (payload as { data: T }).data;
    }

    return payload as T;
  }

  private getErrorMessage(payload: unknown, fallback: string): string {
    if (payload && typeof payload === "object" && "message" in payload) {
      const message = (payload as { message: unknown }).message;
      return Array.isArray(message) ? message.join(", ") : String(message);
    }

    if (typeof payload === "string") {
      return payload;
    }

    return fallback || "Request failed";
  }
}

export const employeeService = new EmployeeService();
