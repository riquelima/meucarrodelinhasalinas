import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { UsersService } from '../users/users.service'; // ajuste path se necessário

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private usersService: UsersService,
    ) { }    

    // valida roles (impede motorista↔motorista)
    async validateRolesForChat(fromId: string, toId: string) {
        const from = await this.usersService.findById(fromId);
        const to = await this.usersService.findById(toId);

        if (!from || !to) throw new BadRequestException('Usuário inválido');

        const fromRoles = from.roles;
        const toRoles = to.roles;

        const fromIsMotorista = Array.isArray(fromRoles) ? fromRoles.includes('motorista') : fromRoles === 'motorista';
        const toIsMotorista = Array.isArray(toRoles) ? toRoles.includes('motorista') : toRoles === 'motorista';

        if (fromIsMotorista && toIsMotorista) {
            throw new ForbiddenException('Motoristas não podem conversar entre si.');
        }

        return { from, to };
    }

    async createMessage(fromId: string, toId: string, content: string) {
        await this.validateRolesForChat(fromId, toId);
        const msg = new this.messageModel({
            from: new Types.ObjectId(fromId),
            to: new Types.ObjectId(toId),
            content,
        });
        return msg.save();
    }

    // mensagens entre dois usuários (paginação simples)
    async getMessagesBetween(userA: string, userB: string, limit = 50) {
        return this.messageModel
            .find({
                $or: [
                    { from: userA, to: userB },
                    { from: userB, to: userA },
                ],
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

}
