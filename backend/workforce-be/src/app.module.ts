import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';
import { Employee } from './employee/entities/employee.entity';
import { Department } from './department/entities/department.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { LeaveRequest } from './leave-request/entities/leave-request.entity';
import { AuthModule } from './auth/auth.module';
import { BlacklistedToken } from './auth/entities/blacklisted-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Employee,
          Department,
          Attendance,
          LeaveRequest,
          BlacklistedToken,
        ],
        synchronize: true, //use synchronize false for production
      }),
      inject: [ConfigService],
    }),
    UserModule,
    EmployeeModule,
    DepartmentModule,
    AttendanceModule,
    LeaveRequestModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
