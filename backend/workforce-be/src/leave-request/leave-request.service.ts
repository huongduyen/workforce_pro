import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaveRequest } from './entities/leave-request.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    this.ensureValidDateRange(
      createLeaveRequestDto.startDate,
      createLeaveRequestDto.endDate,
    );

    const employee = await this.getEmployee(createLeaveRequestDto.employeeId);
    const leaveRequest = this.leaveRequestRepository.create({
      employee,
      type: createLeaveRequestDto.type,
      startDate: new Date(createLeaveRequestDto.startDate),
      endDate: new Date(createLeaveRequestDto.endDate),
      reason: createLeaveRequestDto.reason.trim(),
      status: createLeaveRequestDto.status,
    });

    const savedLeaveRequest =
      await this.leaveRequestRepository.save(leaveRequest);
    return await this.findOne(savedLeaveRequest.id);
  }

  async findAll(): Promise<LeaveRequest[]> {
    return await this.leaveRequestRepository.find({
      relations: { employee: { department: true } },
      order: { startDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: { employee: { department: true } },
    });

    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }

    return leaveRequest;
  }

  async update(
    id: string,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);
    const startDate =
      updateLeaveRequestDto.startDate ?? this.toDateOnly(leaveRequest.startDate);
    const endDate =
      updateLeaveRequestDto.endDate ?? this.toDateOnly(leaveRequest.endDate);

    this.ensureValidDateRange(startDate, endDate);

    if (updateLeaveRequestDto.employeeId !== undefined) {
      leaveRequest.employee = await this.getEmployee(
        updateLeaveRequestDto.employeeId,
      );
    }

    if (updateLeaveRequestDto.type !== undefined) {
      leaveRequest.type = updateLeaveRequestDto.type;
    }

    if (updateLeaveRequestDto.startDate !== undefined) {
      leaveRequest.startDate = new Date(updateLeaveRequestDto.startDate);
    }

    if (updateLeaveRequestDto.endDate !== undefined) {
      leaveRequest.endDate = new Date(updateLeaveRequestDto.endDate);
    }

    if (updateLeaveRequestDto.reason !== undefined) {
      leaveRequest.reason = updateLeaveRequestDto.reason.trim();
    }

    if (updateLeaveRequestDto.status !== undefined) {
      leaveRequest.status = updateLeaveRequestDto.status;
    }

    await this.leaveRequestRepository.save(leaveRequest);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const leaveRequest = await this.findOne(id);
    await this.leaveRequestRepository.remove(leaveRequest);
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

  private ensureValidDateRange(startDate: string, endDate: string): void {
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  private toDateOnly(value: Date | string): string {
    return String(value).slice(0, 10);
  }
}
