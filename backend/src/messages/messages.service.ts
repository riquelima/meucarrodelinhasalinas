import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { UsersService } from '../users/users.service'; // ajuste path se necessário
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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
            .populate('from', 'name avatar status')
            .populate('to', 'name avatar status')
            .lean()
            .exec();
    }

    async getUserConversations(userId: string) {
        const objectId = new Types.ObjectId(userId);

        // 1️⃣ Buscar todas as mensagens onde o usuário é from ou to
        const messages = await this.messageModel
            .find({
                $or: [{ from: objectId }, { to: objectId }],
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!messages.length) return [];

        // 2️⃣ Pegar os IDs únicos dos contatos (quem não é o próprio usuário)
        // transformar todos os IDs em string para comparar e buscar
        const contactIdsStr = [
            ...new Set(
                messages.map(m =>
                    m.from.toString() === userId ? m.to.toString() : m.from.toString(),
                ),
            ),
        ];

        const contacts = await this.userModel
            .find({ _id: { $in: contactIdsStr } })
            .select('name avatar status')
            .lean();

        console.log('Contacts found:', contacts);

        // 3️⃣ Calcular não lidas por contato (agregação)
        const unreadByContact = await this.messageModel.aggregate([
            { $match: { to: objectId, isRead: false } },
            { $group: { _id: '$from', count: { $sum: 1 } } },
        ]);
        const unreadMap = new Map<string, number>(
            unreadByContact.map((u: any) => [u._id.toString(), u.count])
        );

        // 4️⃣ Montar lista de conversas
        const conversations = contactIdsStr.map(contactId => {
            const lastMessage = messages.find(
                m =>
                    m.from.toString() === contactId.toString() ||
                    m.to.toString() === contactId.toString(),
            );

            const user = contacts.find(c => c._id.toString() === contactId.toString());


            return {
                id: contactId.toString(),
                name: user?.name || 'Usuário',
                lastMessage: lastMessage?.content || '',
                time: lastMessage?.createdAt
                    ? this.formatTime(lastMessage.createdAt)
                    : '',
                unread: unreadMap.get(contactId.toString()) || 0,
                photo:
                    user?.avatar ||
                    'https://via.placeholder.com/150x150.png?text=Sem+Foto',
                status: (user as any)?.status || 'offline',
            };
        });

        return conversations;
    }

    async getTotalUnreadCount(userId: string) {
        const objectId = new Types.ObjectId(userId);
        const count = await this.messageModel.countDocuments({ to: objectId, isRead: false });
        return { count };
    }

    private formatTime(date: Date) {
        const diffMs = Date.now() - new Date(date).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        return `${diffDays} dias atrás`;
    }

    async getAllMessages() {
        return this.messageModel.find().exec();
    }
}





