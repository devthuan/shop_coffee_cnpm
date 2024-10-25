import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  exports: [MailService],  // Make MailService available to other modules
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
