import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageGateway } from './messages.gateway';
import { MessageService } from './messages.service';
import { Message, MessageSchema } from './schemas/message.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module'; 
import { MessageController } from './messages.controller';
import { User } from 'src/users/schemas/user.schema';
import { UserSchema } from 'src/users/schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    AuthModule, 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
