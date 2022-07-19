import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../shared/entities/messages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
    @InjectRepository(MessageEntity)
    private readonly repository: Repository<MessageEntity>

    async getMessages(subId: string) {
        this.repository.metadata.tablePath = `${subId}_messages`

        return await this.repository.find()
    }
}
