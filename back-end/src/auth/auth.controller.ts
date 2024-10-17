import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/register.dto';
import {  VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from './auth.guard';
import { plainToInstance } from 'class-transformer';
import { Accounts } from './entities/accounts.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    if(createAuthDto.password !== createAuthDto.confirmPassword){
      throw new Error('Passwords do not match');
    }
    return this.authService.create(createAuthDto);  
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('send-otp')
  sendOtp(@Body() emailDto: EmailDto) {
    return this.authService.sendOTP(emailDto.email);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    if(changePasswordDto.newPassword !== changePasswordDto.newPasswordConfirm){
      return {
        message: 'Passwords do not match'
      }
    }
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto.email);
  }

  @Get('accounts')
  getAllAccount(
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC' 
  ) {
    let data = this.authService.getAllAccount(search, page, limit, sortBy, sortOrder);
    return plainToInstance(Accounts, data)
  }
 
}
