import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/common/decorators/roles.decorator';
import { SupportEmailDto } from './dto/support-email.dto';

@Controller('support')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post()
  async sendSupport(@Body() data: SupportEmailDto) {
    await this.emailService.sendSupportEmail(data.email, data.message);
    return { success: true };
  }
}
