import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/roles.guard';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('Meu Carro de Linha API')
        .setDescription('API para gerenciar passageiros, motoristas, anúncios, rotas e chat')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
    //console.log(`Aplicação rodando em http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();
