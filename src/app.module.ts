import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { GraphApiModule } from './graph-api/graph-api.module';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    }),
    WebhookModule, 
    GraphApiModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
