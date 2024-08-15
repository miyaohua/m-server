import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import uses from './common/uses';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  uses(app)
  await app.listen(3000, "172.20.10.2");
}
bootstrap();
