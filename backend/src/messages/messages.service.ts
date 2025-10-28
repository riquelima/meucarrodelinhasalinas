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

        if (fromId === toId) {
            throw new BadRequestException('Não é possível enviar mensagens para si mesmo.');
        }

        const from = await this.usersService.findById(fromId);
        const to = await this.usersService.findById(toId);

        if (!from || !to) throw new BadRequestException('Usuário inválido');

        const fromRoles = from.role;
        const toRoles = to.role;

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
        const userAId = new Types.ObjectId(userA);
        const userBId = new Types.ObjectId(userB);

        // COLOCAR MARCAÇÃO DE LIDO AQUI
        await this.messageModel.updateMany(
            { from: userBId, to: userAId, isRead: false },
            { $set: { isRead: true } }
        );

        return this.messageModel
            .find({
                $or: [
                    { from: userAId, to: userBId },
                    { from: userBId, to: userAId },
                ],
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('from', 'name')
            .populate('to', 'name')
            .lean()
            .exec();
    }

    async getUserConversations(userId: string) {
        console.log("Getting conversations for user:", userId);
        const objectId = new Types.ObjectId(userId);

        // Agrupando mensagens por usuário de destino/remetente
        const conversations = await this.messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { from: objectId },
                        { to: objectId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    from: 1,
                    to: 1,
                    content: 1,
                    createdAt: 1,
                    isRead: 1,
                    otherUserId: {
                        $cond: [{ $eq: ['$from', objectId] }, '$to', '$from']
                    }
                }
            },
            {
                $group: {
                    _id: '$otherUserId',
                    lastMessage: { $first: '$content' },
                    lastTime: { $first: '$createdAt' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ['$to', objectId] }, { $eq: ['$isRead', false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    id: '$_id',
                    name: '$user.name',
                    photo: '$user.avatar',
                    role: '$user.role',
                    lastMessage: 1,
                    time: '$lastTime',
                    unread: '$unreadCount'
                }
            },
            {
                $sort: { time: -1 }
            }
        ]);

        return conversations;
    }

    async getAllMessages() {
        return this.messageModel.find().exec();
    }

}

