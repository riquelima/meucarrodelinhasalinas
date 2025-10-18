import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './messages.gateway';
import { MessageService } from './messages.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module'; // 🔹 importa AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    AuthModule, 
  ],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
