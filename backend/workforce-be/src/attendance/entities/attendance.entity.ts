import { Employee } from 'src/employee/entities/employee.entity';
import { AttendanceStatus } from 'src/enum/attendance-status.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  checkIn: string;

  @Column({ type: 'time', nullable: true })
  checkOut: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    enumName: 'attendance_status_enum',
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.attendanceRecords)
  employee: Employee;
}
