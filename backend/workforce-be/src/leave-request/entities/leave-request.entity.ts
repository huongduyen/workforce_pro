import { Employee } from '../../employee/entities/employee.entity';
import { LeaveStatus } from '../../enum/leave-status.enum';
import { LeaveType } from '../../enum/leave-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LeaveType,
    enumName: 'leave_type_enum',
  })
  type: LeaveType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    enumName: 'leave_status_enum',
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.leaveRequests, {
    onDelete: 'CASCADE',
  })
  employee: Employee;
}
