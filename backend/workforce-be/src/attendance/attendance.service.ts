import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const employee = await this.getEmployee(createAttendanceDto.employeeId);
    const attendance = this.attendanceRepository.create({
      employee,
      date: new Date(createAttendanceDto.date),
      checkIn: createAttendanceDto.checkIn || null,
      checkOut: createAttendanceDto.checkOut || null,
      status: createAttendanceDto.status,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);
    return await this.findOne(savedAttendance.id);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      relations: { employee: { department: true } },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: { employee: { department: true } },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = await this.findOne(id);

    if (updateAttendanceDto.employeeId !== undefined) {
      attendance.employee = await this.getEmployee(updateAttendanceDto.employeeId);
    }

    if (updateAttendanceDto.date !== undefined) {
      attendance.date = new Date(updateAttendanceDto.date);
    }

    if (updateAttendanceDto.checkIn !== undefined) {
      attendance.checkIn = updateAttendanceDto.checkIn || null;
    }

    if (updateAttendanceDto.checkOut !== undefined) {
      attendance.checkOut = updateAttendanceDto.checkOut || null;
    }

    if (updateAttendanceDto.status !== undefined) {
      attendance.status = updateAttendanceDto.status;
    }

    await this.attendanceRepository.save(attendance);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }

  private async getEmployee(employeeId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    return employee;
  }
}
