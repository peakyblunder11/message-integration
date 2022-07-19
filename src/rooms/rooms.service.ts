import { ConfigService } from '@nestjs/config';
import { RoomEntity } from './../shared/entities/rooms.entity';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
    @InjectRepository(RoomEntity)
    private readonly repository: Repository<RoomEntity>

    constructor(
        private configService: ConfigService
    ) {}

    async getRoom(subId: string) {
        this.repository.metadata.tablePath = `${subId.toLowerCase()}_rooms`

        return await 
                    this.repository.find()
                    // this.repository.createQueryBuilder('rooms')
                    //     .select()
                    //     .where('rooms.subId = :id', { id: subId })                        
    }

    async saveRoom(subId: string, data: any) {
        return this.repository.save(data)
    }

    async updateRoom(subId: string, instanceId: string, data: any) {
        this.repository.metadata.tablePath = `${subId.toLowerCase()}_rooms`

        return this.repository
                                .createQueryBuilder()
                                .update(data)
                                .where({
                                    instanceId
                                })
                                .returning('*')
                                .execute()
    }

    async upsert(subId: string, instanceId: string, data: any) {
        const room = this.getRoom(subId)

        if (!room) {
            return this.updateRoom(subId, instanceId, data)
        }

        return this.saveRoom(subId, data)
    }

}