import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsString()
  @Length(1, 50)
  employeeId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string | null;

  @IsDateString()
  dateOfBirth: string;

  @IsDateString()
  hireDate: string;

  @IsNumber()
  @Min(0)
  salary: number;

  @IsOptional()
  @IsString()
  position?: string | null;

  @IsOptional()
  @IsUUID()
  departmentId?: string | null;

  @IsOptional()
  @IsUUID()
  userId?: string | null;
}
