import { Module } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { SequelizeConfigService } from 'src/shared/sequelize/sequelize.service';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../shared/entities/rooms.entity';

@Module({
    exports: [RoomsService],
    providers: [RoomsService],
    imports: [
        TypeOrmModule.forFeature([RoomEntity])
    ]
})
export class RoomsModule { }
