import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/shared/entities/messages.entity';
import { ChatsController } from './chats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  exports: [ChatsService],
  providers: [ChatsService],
  controllers: [ChatsController]
})
export class ChatsModule {}
