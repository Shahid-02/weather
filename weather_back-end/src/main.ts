import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  // Apply Helmet middleware to security your application
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: { action: 'deny' },
    }),
  );

  // Setup Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS for cross-origin resource sharing
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  // Start the server
  await app.listen(4000);
}
bootstrap();
