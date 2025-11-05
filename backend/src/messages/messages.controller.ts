import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './messages.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('conversations/:id')
  async getConversations(@Param('id') id: string) {
    return this.messageService.getUserConversations(id);
  }

  @Get('unread-count/:id')
  async getUnreadCount(@Param('id') id: string) {
    return this.messageService.getTotalUnreadCount(id);
  }

  @Get()
    async getAllMessages() {
        return this.messageService.getAllMessages();
    }
}
