import { Employee } from 'src/employee/entities/employee.entity';
import { LeaveStatus } from 'src/enum/leave-status.enum';
import { LeaveType } from 'src/enum/leave-type.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.leaveRequests)
  employee: Employee;
}
