import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    await this.ensureNameIsAvailable(createDepartmentDto.name);

    const department = this.departmentRepository.create({
      name: createDepartmentDto.name.trim(),
      description: createDepartmentDto.description?.trim() || null,
    });

    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: { employees: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: { employees: true },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (
      updateDepartmentDto.name &&
      updateDepartmentDto.name.trim() !== department.name
    ) {
      await this.ensureNameIsAvailable(updateDepartmentDto.name, id);
      department.name = updateDepartmentDto.name.trim();
    }

    if (updateDepartmentDto.description !== undefined) {
      department.description = updateDepartmentDto.description?.trim() || null;
    }

    await this.departmentRepository.save(department);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    const employeeCount = await this.employeeRepository.count({
      where: { department: { id } },
    });

    if (employeeCount > 0) {
      throw new BadRequestException(
        'Department has employees assigned. Reassign employees before deleting it.',
      );
    }

    await this.departmentRepository.remove(department);
  }

  private async ensureNameIsAvailable(
    name: string,
    ignoredDepartmentId?: string,
  ): Promise<void> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: name.trim() },
    });

    if (
      existingDepartment &&
      existingDepartment.id !== ignoredDepartmentId
    ) {
      throw new ConflictException('Department with this name already exists');
    }
  }
}
