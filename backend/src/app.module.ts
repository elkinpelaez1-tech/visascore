import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VisaTestModule } from './modules/visa-test/visa-test.module';
import { ScoringModule } from './modules/scoring/scoring.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    ThrottlerModule.forRoot([{
        ttl: 60000,
        limit: 10,
    }]),
    AuthModule, 
    UsersModule, 
    VisaTestModule, 
    ScoringModule, 
    PaymentsModule, 
    ReportsModule, 
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
