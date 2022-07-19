import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/shared/entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  exports: [ChatsService],
  providers: [ChatsService]
})
export class ChatsModule {}
