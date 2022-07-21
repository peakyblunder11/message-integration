import { Body, Controller, Get, Query, Post, Put } from '@nestjs/common';
import { RoomEntity } from 'src/shared/entities/rooms.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {

    constructor(private service: RoomsService) {}

    @Get()
    getAll(
        @Query() query: { subId: string }
    ) {
        // return this.service.getRoom(query.subId)
    }

    @Post()
    insert( 
        @Body() body: RoomEntity,
        @Query() query: { subId: string }
    ) {
        return this.service.saveRoom(query.subId, body)
    }

    @Put()
    update(
        @Body() body: RoomEntity,
        @Query() query: { subId: string, instanceId: string }
    ) {
        return this.service.updateRoom(query.subId, query.instanceId, body)
    }

}
