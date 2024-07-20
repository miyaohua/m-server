import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Global()
@Module({
  providers: [EmailService],
  controllers: [],
  exports: [EmailService]
})
export class EmailModule { }
