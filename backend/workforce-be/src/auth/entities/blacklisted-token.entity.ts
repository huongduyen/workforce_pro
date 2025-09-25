import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
