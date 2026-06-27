import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({ origin: '*' });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtro global de exceções
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Cache headers para Swagger
  const swaggerPath = 'api-docs';
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SeuPreto Platform API')
    .setDescription('API para gerenciamento de barbearia - Agendamentos, Clientes e Autenticação')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'SeuPreto Platform API',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info .title { color: #1a1a2e; font-size: 2rem; }
      .swagger-ui .info .description p { font-size: 1rem; color: #444; }
      .swagger-ui .opblock-tag { font-size: 1.1rem; border-bottom: 1px solid #e8e8e8; }
      .swagger-ui .opblock .opblock-summary-operation-id { font-size: 0.9rem; }
      .swagger-ui .btn.execute { background-color: #1a1a2e; border-color: #1a1a2e; }
      .swagger-ui .btn.execute:hover { background-color: #16213e; }
      body { background: #fafafa; }
    `,
  });

  await app.listen(3000);
  logger.log('🚀 SeuPreto Platform API rodando na porta 3000');
  logger.log(`📚 Documentação disponível em /api-docs`);
}
bootstrap();
