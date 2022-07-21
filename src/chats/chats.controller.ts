import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ChatsService } from './chats.service'
import { MessageEntity } from '../shared/entities/messages.entity'

@Controller('chats')
export class ChatsController {

    constructor(
        private service: ChatsService
    ) { }

    @Get()
    getMessages(
        @Query() query: { subId: string }
    ) {
        return this.service.getMessages(query.subId)
    }

    @Post()
    saveMessages(
        @Query() query: { subId: string },
        @Body() body: MessageEntity
    ) {
        return this.service.saveMessages(query.subId, body)
    }

}
