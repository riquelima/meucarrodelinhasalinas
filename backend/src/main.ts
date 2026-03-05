import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/roles.guard';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

dotenv.config();

import { APP_CONFIG } from './config';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors({
      origin: [
        'http://localhost:5173',
        'https://meucarrodelinhasalinas.com.br',
        APP_CONFIG.CLIENT_URL || 'http://localhost:5173',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Meu Carro de Linha API')
      .setDescription('API para gerenciar passageiros, motoristas, anúncios, rotas e chat')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.setGlobalPrefix('api'); // <--- A Vercel manda o fallback para /api

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Inicia localmente se não estiver no Vercel
if (!process.env.VERCEL) {
  bootstrap().then(app => {
    const port = APP_CONFIG.PORT ?? 8080;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Aplicativo rodando localmente na porta ${port}`);
    });
  });
}

// Exporta o handler para a Vercel Serverless Function
export default async function handler(req: any, res: any) {
  try {
    await bootstrap();
    server(req, res);
  } catch (error) {
    console.error('CRITICAL VERCEL ERROR BOOTSTRAPPING NEST: ', error);
    res.status(500).json({
      message: 'Internal Server Error no NestJS',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
