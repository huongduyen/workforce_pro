/* eslint-disable prettier/prettier */
import { Employee } from '../../employee/entities/employee.entity';
import { Role } from '../../enum/role.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({type: 'varchar', length: 255})
  password: string;

  @Column({type: 'boolean', default: true})
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'user_role_enum',
    default: Role.EMPLOYEE,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamp' }) 
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) 
  updatedAt: Date;

  @OneToOne(() => Employee, (employee: Employee) => employee.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  employee?: Employee | null;
}
