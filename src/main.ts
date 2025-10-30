import { AllExceptionsFilter } from '@common/filters/exceptions';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';


const bootstrapLog = (port: number) => {
  const version = '1.0.0';
  const environment = process.env.NODE_ENV || 'development';
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║     📚 Book Management System (BMS) 🚀                ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  Status     : ✅ Running                              ║`);
  console.log(`║  Version    : v${version.padEnd(39)}║`);
  console.log(`║  Port       : ${port.toString().padEnd(39)} ║`);
  console.log(`║  Environment: ${environment.toUpperCase().padEnd(39)} ║`);
  console.log(`║  Timestamp  : ${timestamp.padEnd(39)} ║`);
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║  API        : http://localhost:${port}                   ║`);
  console.log('╚═══════════════════════════════════════════════════════╝\n');
};


async function bootstrap() {

  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();


  await app.listen(port);
  bootstrapLog(Number(port));
}
bootstrap();
