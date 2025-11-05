import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // ajuste path se necessário

interface AuthPayload { sub: string; email?: string; role?: string; iat?: number; exp?: number }

@WebSocketGateway({
    cors: {
        origin: '*', // restrinja em produção
        credentials: true,
    },
    namespace: '/chat',
})
@Injectable()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger('MessageGateway');

    // map socket.id -> userId
    private clients = new Map<string, string>();

    constructor(
        private jwtService: JwtService,
        private messageService: MessageService,
        private usersService: UsersService,
    ) { }

    afterInit(server: Server) {
        this.logger.log('Chat gateway initialized');
    }

    async handleConnection(client: Socket) {
        try {
            // token pode vir em client.handshake.auth.token ou headers.authorization
            const authHeader = client.handshake.auth && client.handshake.auth.token;
            const bearer = authHeader || client.handshake.headers['authorization'];
            if (!bearer) throw new Error('Token não fornecido');

            const token = typeof bearer === 'string' && bearer.startsWith('Bearer ')
                ? bearer.split(' ')[1]
                : bearer;

            const payload = this.jwtService.verify<AuthPayload>(token);
            const userId = payload.sub;

            const user = await this.usersService.findById(userId);
            if (!user) throw new Error('Usuário inválido');

            // armazena
            this.clients.set(client.id, userId);
            // também adiciona ao socket para fácil acesso
            (client as any).user = user;

            this.logger.log(`Client connected: ${client.id} (user ${userId})`);
        } catch (err) {
            this.logger.warn(`Falha conexão socket ${client.id}: ${err.message}`);
            client.emit('error', 'Autenticação falhou');
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.clients.get(client.id);
        this.clients.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id} (user ${userId})`);
    }

    // enviar mensagem privada
    @SubscribeMessage('private_message')
    async handlePrivateMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: SendMessageDto) {
        const me = (client as any).user;
        if (!me) return client.emit('error', 'Não autenticado');

        try {
            const saved = await this.messageService.createMessage(me._id.toString(), dto.to, dto.content);
            
            // Populate para enviar com dados completos
            const populated = await saved.populate([
                { path: 'from', select: 'name avatar status' },
                { path: 'to', select: 'name avatar status' }
            ]);

            // envia mensagem pro destinatário, se ele estiver conectado
            for (const [socketId, userId] of this.clients.entries()) {
                if (userId === dto.to) {
                    this.server.to(socketId).emit('message_sent', populated);
                }
            }

            // também devolve pro remetente
            client.emit('message_sent', populated);
        } catch (err) {
            client.emit('error', err.message || 'Erro ao enviar mensagem');
        }
    }

    // consulta histórico via socket (alternativa ao REST)
    @SubscribeMessage('get_history')
    async handleGetHistory(@ConnectedSocket() client: Socket, @MessageBody() payload: { withUserId: string, limit?: number, before?: string }) {
        const me = (client as any).user;
        if (!me) return client.emit('error', 'Não autenticado');

        const beforeDate = payload.before ? new Date(payload.before) : undefined;
        const messages = await this.messageService.getMessagesBetween(me._id.toString(), payload.withUserId, payload.limit ?? 50);
        client.emit('history', messages);
    }
}
