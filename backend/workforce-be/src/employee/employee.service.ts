import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from '../department/entities/department.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    await this.ensureEmployeeIdIsAvailable(createEmployeeDto.employeeId);

    const department = await this.resolveDepartment(
      createEmployeeDto.departmentId,
    );
    const user = await this.resolveAvailableUser(createEmployeeDto.userId);

    const employee = this.employeeRepository.create({
      firstName: createEmployeeDto.firstName.trim(),
      lastName: createEmployeeDto.lastName.trim(),
      employeeId: createEmployeeDto.employeeId.trim(),
      phoneNumber: createEmployeeDto.phoneNumber?.trim() || null,
      dateOfBirth: new Date(createEmployeeDto.dateOfBirth),
      hireDate: new Date(createEmployeeDto.hireDate),
      salary: createEmployeeDto.salary,
      position: createEmployeeDto.position?.trim() || null,
      department,
    });

    const savedEmployee = await this.employeeRepository.save(employee);

    if (user) {
      user.employee = savedEmployee;
      await this.userRepository.save(user);
    }

    return await this.findOne(savedEmployee.id);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      relations: { department: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: {
        department: true,
        attendanceRecords: true,
        leaveRequests: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (
      updateEmployeeDto.employeeId &&
      updateEmployeeDto.employeeId.trim() !== employee.employeeId
    ) {
      await this.ensureEmployeeIdIsAvailable(updateEmployeeDto.employeeId, id);
      employee.employeeId = updateEmployeeDto.employeeId.trim();
    }

    if (updateEmployeeDto.firstName !== undefined) {
      employee.firstName = updateEmployeeDto.firstName.trim();
    }

    if (updateEmployeeDto.lastName !== undefined) {
      employee.lastName = updateEmployeeDto.lastName.trim();
    }

    if (updateEmployeeDto.phoneNumber !== undefined) {
      employee.phoneNumber = updateEmployeeDto.phoneNumber?.trim() || null;
    }

    if (updateEmployeeDto.dateOfBirth !== undefined) {
      employee.dateOfBirth = new Date(updateEmployeeDto.dateOfBirth);
    }

    if (updateEmployeeDto.hireDate !== undefined) {
      employee.hireDate = new Date(updateEmployeeDto.hireDate);
    }

    if (updateEmployeeDto.salary !== undefined) {
      employee.salary = updateEmployeeDto.salary;
    }

    if (updateEmployeeDto.position !== undefined) {
      employee.position = updateEmployeeDto.position?.trim() || null;
    }

    if (updateEmployeeDto.departmentId !== undefined) {
      employee.department = await this.resolveDepartment(
        updateEmployeeDto.departmentId,
      );
    }

    await this.employeeRepository.save(employee);

    if (updateEmployeeDto.userId !== undefined) {
      await this.syncUserLink(employee, updateEmployeeDto.userId);
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.syncUserLink(employee, null);
    await this.employeeRepository.remove(employee);
  }

  private async ensureEmployeeIdIsAvailable(
    employeeId: string,
    ignoredEmployeeId?: string,
  ): Promise<void> {
    const existingEmployee = await this.employeeRepository.findOne({
      where: { employeeId: employeeId.trim() },
    });

    if (existingEmployee && existingEmployee.id !== ignoredEmployeeId) {
      throw new ConflictException('Employee with this employee ID already exists');
    }
  }

  private async resolveDepartment(
    departmentId?: string | null,
  ): Promise<Department | null> {
    if (!departmentId) {
      return null;
    }

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    return department;
  }

  private async resolveAvailableUser(userId?: string | null): Promise<User | null> {
    if (!userId) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.employee) {
      throw new ConflictException('User is already linked to an employee');
    }

    return user;
  }

  private async syncUserLink(
    employee: Employee,
    userId?: string | null,
  ): Promise<void> {
    const currentUser = await this.userRepository.findOne({
      where: { employee: { id: employee.id } },
      relations: { employee: true },
    });

    if (!userId) {
      if (currentUser) {
        currentUser.employee = null;
        await this.userRepository.save(currentUser);
      }
      return;
    }

    const nextUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: { employee: true },
    });

    if (!nextUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (nextUser.employee && nextUser.employee.id !== employee.id) {
      throw new ConflictException('User is already linked to another employee');
    }

    if (currentUser && currentUser.id !== nextUser.id) {
      currentUser.employee = null;
      await this.userRepository.save(currentUser);
    }

    nextUser.employee = employee;
    await this.userRepository.save(nextUser);
  }
}
