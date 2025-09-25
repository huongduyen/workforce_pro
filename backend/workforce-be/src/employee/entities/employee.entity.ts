import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Department } from 'src/department/entities/department.entity';
import { User } from 'src/user/entities/user.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { LeaveRequest } from 'src/leave-request/entities/leave-request.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  employeeId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ nullable: true })
  position: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @OneToOne(() => User, (user) => user.employee)
  user: User;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendanceRecords: Attendance[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[];
}
