import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/register.dto';
import {  VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { plainToInstance } from 'class-transformer';
import { Accounts } from './entities/accounts.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginGoogle } from './auth.interface';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardCustom } from './auth.guard';

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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    console.log(req)
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // redirect to home page
    let infoUser : LoginGoogle = req.user
    return this.authService.loginWithGoogle(infoUser)
   
  }
  
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('send-otp')
  sendOtp(@Body() emailDto: EmailDto) {
    return this.authService.sendOTP(emailDto.email);
  }

  @UseGuards(AuthGuardCustom)
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

  
 
}
