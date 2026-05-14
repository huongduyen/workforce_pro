import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { LeaveStatus } from '../../enum/leave-status.enum';
import { LeaveType } from '../../enum/leave-type.enum';

export class CreateLeaveRequestDto {
  @IsUUID()
  employeeId: string;

  @IsEnum(LeaveType)
  type: LeaveType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @Length(1, 500)
  reason: string;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;
}
