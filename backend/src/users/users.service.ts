import { Injectable, Inject, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { MotoristaDocument } from './schemas/motorista.schema';
import { AnuncianteDocument } from './schemas/anunciante.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject('MOTORISTA_MODEL') private motoristaModel: Model<MotoristaDocument>,
        @Inject('ANUNCIANTE_MODEL') private anuncianteModel: Model<AnuncianteDocument>,
    ) { }

    /** Método auxiliar para escolher o model pelo role do JWT */
    private getModelByRoleFromUser(user: any): Model<any> {
        console.log('User role:', user.role);
        switch (user.role) {
            case UserRole.MOTORISTA:
                return this.motoristaModel;
            case UserRole.ANUNCIANTE:
                return this.anuncianteModel;
            default:
                return this.userModel;
        }
    }

    /** Cria usuário de acordo com o role */
    async create(dto: any) {

        // Verifica se o email já existe
        if (await this.userModel.findOne({ email: dto.email })) {
            throw new Error('Email já cadastrado');
        }

        const hashed = await bcrypt.hash(dto.password, 10);

        let created;
        switch (dto.role) {
            case UserRole.MOTORISTA:
                created = new this.motoristaModel({ ...dto, password: hashed });
                break;
            case UserRole.ANUNCIANTE:
                created = new this.anuncianteModel({ ...dto, password: hashed });
                break;
            default:
                created = new this.userModel({ ...dto, password: hashed });
                break;
        }

        return created.save();
    }

    /** Atualiza dados do usuário atual com base no JWT */
    async updateCurrentUser(updateData: UpdateUserDto, user: any) {
        const model = this.getModelByRoleFromUser(user);

        console.log('User:', user);

        // Atualiza e retorna o documento atualizado do Mongoose
        const updatedUser = await model.findByIdAndUpdate(
            user.userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) throw new Error('Usuário não encontrado');

        return updatedUser; // aqui é a instância do model correto
    }


    /** Atualiza rating de qualquer usuário */
    async updateRating(userId: string, newAvg: number, totalReviews: number) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { avgRating: newAvg, totalReviews },
            { new: true },
        );
    }

    async incrementProfileView(userId: string) {
        return this.userModel.findByIdAndUpdate(
            userId,
            { $inc: { profileViews: 1 } },
            { new: true },
        );
    }

    async findAllMotoristas() {
        return this.motoristaModel.find().lean();
    }

    async findAllAnunciantes() {
        return this.anuncianteModel.find().lean();
    }

    async mudarStatusMotorista(id: string, status: string) {
        const motorista = await this.motoristaModel.findById(id);
        if (!motorista) throw new Error('Motorista não encontrado');

        motorista.status = status;
        return motorista.save();
    }


    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).lean();
    }

    async findById(id: string) {
        return this.userModel.findById(id).lean();
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
}
