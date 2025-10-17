import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Motorista, MotoristaSchema } from './schemas/motorista.schema';
import { Anunciante, AnuncianteSchema } from './schemas/anunciante.schema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: () => {
                    const schema = UserSchema;
                    schema.discriminator('motorista', MotoristaSchema);
                    schema.discriminator('anunciante', AnuncianteSchema);
                    return schema;
                },
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
