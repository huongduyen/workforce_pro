/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return { message: 'User created successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const user = await this.userService.findAll();
    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      success: true,
      user,
      message: 'User read successfully',
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);
    return {
      success: true,
      data,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return {
      success: true,
      message: 'User removed successfully',
    };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const user = await this.userService.deactivate(id);
    return {
      success: true,
      user,
      message: 'User deactivated successfully',
    };
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    const user = await this.userService.activate(id);
    return {
      success: true,
      user,
      message: 'User activated successfully',
    };
  }
}
