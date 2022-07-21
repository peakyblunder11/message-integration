import { Module } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { SequelizeConfigService } from 'src/shared/sequelize/sequelize.service';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../shared/entities/rooms.entity';
import { RoomsController } from './rooms.controller';

@Module({
    exports: [RoomsService],
    providers: [RoomsService],
    imports: [
        TypeOrmModule.forFeature([RoomEntity])
    ],
    controllers: [RoomsController]
})
export class RoomsModule { }
