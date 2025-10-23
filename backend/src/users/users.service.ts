import { Injectable, Inject, Scope, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { MotoristaDocument } from './schemas/motorista.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject('MOTORISTA_MODEL') private motoristaModel: Model<MotoristaDocument>,        
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
                created = new this.motoristaModel({ ...dto, password: hashed});
                break;            
            default:
                created = new this.userModel({ ...dto, password: hashed });
                break;
        }

        return created.save();
    }

    /** Atualiza dados do usuário atual com base no userId */
    async updateCurrentUser(updateData: UpdateUserDto, idUser: string) {
        const model = await this.getModelByRoleFromUser(idUser);        

        // Atualiza e retorna o documento atualizado do Mongoose
        const updatedUser = await model.findByIdAndUpdate(
            idUser,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) throw new NotFoundException('Usuário não encontrado');

        return updatedUser; 
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

        console.log('User found:', model.modelName);

        if (!userReturn) throw new NotFoundException('Usuário não encontrado');
        
        if (model === this.motoristaModel) {
            console.log('Incrementando profile view do motorista');
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
        return this.userModel.find().lean().exec();
    }
}
