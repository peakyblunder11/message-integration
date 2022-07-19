import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookSubscription } from 'src/shared/entities/facebook-subscription.entity'
import { GraphApiModule } from '../graph-api/graph-api.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacebookSubscription]),
    GraphApiModule,
    RoomsModule
  ],
  providers: [
    WebhookService,
  ],
  controllers: [WebhookController]
})
export class WebhookModule {}
