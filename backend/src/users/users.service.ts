import { Injectable, Inject, Scope, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { MotoristaDocument } from './schemas/motorista.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject('MOTORISTA_MODEL') private motoristaModel: Model<MotoristaDocument>,
        private readonly cloudinaryService: CloudinaryService,
        private readonly emailService: EmailService,
    ) { }

    /** Método auxiliar para escolher o model pelo role do Id */
    private async getModelByRoleFromUser(idUser: string): Promise<Model<any>> {

        const userRole = await this.getUserRoleFromId(idUser);

        if (!userRole) {
            throw new NotFoundException('Usuário não encontrado');
        }

        switch (userRole) {
            case UserRole.MOTORISTA:
                return this.motoristaModel;
            default:
                return this.userModel;
        }
    }

    /** Cria usuário de acordo com o role */
    async create(dto: any) {

        // Verifica se o email já existe
        if (await this.userModel.findOne({ email: dto.email })) {
            throw new ConflictException('Email já cadastrado');
        }

        const hashed = await bcrypt.hash(dto.password, 10);

        let created;
        switch (dto.role) {
            case UserRole.MOTORISTA:
                created = new this.motoristaModel({ ...dto, password: hashed });
                break;
            default:
                created = new this.userModel({ ...dto, password: hashed });
                break;
        }

        await this.emailService.sendWelcomeEmail(created.email, created.name);

        return created.save();
    }

    /** Atualiza dados do usuário atual com base no userId */
    async updateCurrentUser(
        updateData: Partial<UpdateUserDto>,
        idUser: string,
        file?: Express.Multer.File
    ) {
        const model = await this.getModelByRoleFromUser(idUser);

        // Busca o documento completo
        const user = await model.findById(idUser);
        if (!user) throw new NotFoundException('Usuário não encontrado');

        //Upload de avatar
        if (file) {
            const url = await this.cloudinaryService.uploadImage(file, 'users_avatar');
            updateData.avatar = url.secure_url;
        }

        // Hash da senha
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Filtra campos válidos
        const allowedFields = [
            'name', 'email', 'password', 'number', 'avatar',
            'vehicle', 'licensePlate', 'origin', 'destination',
            'description', 'carColor', 'seatsAvailable', 'availableDays', 'status',
            'companyName', 'cnpj'
        ];

        for (const key of Object.keys(updateData)) {
            if (allowedFields.includes(key)) {
                user[key] = updateData[key];
            }
        }


        return await user.save();
    }



    /** Atualiza rating de qualquer usuário */
    async updateRating(userId: string, newAvg: number, totalReviews: number) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { avgRating: newAvg, totalReviews },
            { new: true },
        );

        if (!user) throw new NotFoundException('Usuário não encontrado');

        return user;
    }

    async incrementProfileView(userId: string) {

        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Usuário não encontrado');

        return this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { profileViews: 1 } },
            { new: true },
        );
    }

    async findAllMotoristas() {
        return this.motoristaModel.find().lean().exec();
    }


    // async findAllAnunciantes() {
    //     return this.anuncianteModel.find().lean().exec();
    // }

    async mudarStatusMotorista(id: string, status: string) {
        const motorista = await this.motoristaModel.findById(id);
        if (!motorista) throw new NotFoundException('Motorista não encontrado');

        motorista.status = status;
        return motorista.save();
    }


    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email }).lean();
        return user;
    }

    /** Encontrar usuario por ID com dados basicos */
    async findById(id: string) {
        const user = await this.userModel.findById(id).lean();
        return user;
    }

    /** Encontrar usuario por ID, dados completo */
    async findByIdComplete(id: string) {
        const model = await this.getModelByRoleFromUser(id);
        const userReturn = await model.findById(id).lean();

        if (!userReturn) throw new NotFoundException('Usuário não encontrado');

        if (model === this.motoristaModel) {
            await this.incrementProfileView(id);
        }

        return userReturn;
    }

    /** Deleta todos os usuários */
    async deleteAll() {
        return this.userModel.deleteMany({});
    }

    /** Top motoristas por visualizações */
    async getTopMotoristasByProfileViews(limit = 5) {
        return this.motoristaModel
            .find()
            .sort({ profileViews: -1 })
            .limit(limit)
            .lean();
    }

    /** Pega o role do usuário pelo ID */
    private async getUserRoleFromId(userId: string): Promise<UserRole> {
        const user = await this.userModel.findById(userId).lean();
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return user.role;
    }

    async findAllUsers() {
        return this.userModel.find().sort({ createdAt: -1 }).lean().exec();
    }

    async getUserCount() {
        return this.userModel.countDocuments();
    }

    async updatePassword(userId: string, hashedPassword: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Usuário não encontrado');

        user.password = hashedPassword;
        return user.save();
    }

    async deleteById(id: string, currentUserId?: string) {
        // Impede que o usuário delete a própria conta
        if (currentUserId && id === currentUserId) {
          throw new ForbiddenException('Você não pode excluir sua própria conta');
        }
        
        const deleted = await this.userModel.findByIdAndDelete(id).exec();
        
        if (!deleted) {
          throw new NotFoundException('Usuario não encontrado');
        }
    
        return { message: 'Usuario deletado com sucesso' };
      }

    async getMonthlyGrowth() {
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const currentMonthTotal = await this.userModel.countDocuments({
            createdAt: { $lte: now }
        });

        const previousMonthTotal = await this.userModel.countDocuments({
            createdAt: { $lte: previousMonthEnd }
        });

        let growth = 0;
        if (previousMonthTotal > 0) {
            growth = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
        } else if (previousMonthTotal === 0 && currentMonthTotal > 0) {
            growth = 0; // Não há dados anteriores para comparar
        }

        return {
            currentMonth: currentMonthTotal,
            previousMonth: previousMonthTotal,
            growth: Math.round(growth * 100) / 100
        };
    }

    async getChartData(months: number = 4) {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

        const monthsArray: Array<{ month: string; count: number }> = [];
        let accumulatedCount = 0;

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            const monthName = date.toLocaleString('pt-BR', { month: 'short' });

            const monthCount = await this.userModel.countDocuments({
                createdAt: { 
                    $gte: startDate,
                    $lte: monthEnd
                }
            });

            accumulatedCount = monthCount;
            monthsArray.push({
                month: monthName,
                count: accumulatedCount
            });
        }

        return monthsArray;
    }
}
