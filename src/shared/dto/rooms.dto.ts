import { IsObject, IsString, IsNumber, IsNotEmpty, IsBoolean } from "class-validator"

export class RoomsDto {
    
    @IsString()
    public phone_number: string

    @IsString()
    public name: string

    @IsString()
    public phone_number_show: string

    @IsString()
    public profile_picture: string

    @IsString()
    public instance_id: string

    @IsBoolean()
    public sync_firestore: boolean

    @IsNumber()
    public unread_count: number

    @IsString()
    public roomId: string

    @IsObject()
    public assign_to: any

    @IsBoolean()
    public pinned: boolean

    @IsObject()
    public last_interaction

    @IsBoolean()
    public archived: boolean

    @IsString()
    public roomStatus: string

    @IsBoolean()
    public unreplied: boolean

    @IsNumber()
    public last_reply: number

    @IsNumber()
    public last_message: number

    @IsObject()
    public lastMessage

    @IsNumber()
    public message_from_me: number

    @IsString()
    public roomName: string

    @IsString()
    public roomOwnerId: string

    @IsString()
    public roomOwnerName: string

    @IsString()
    public subId: string

    @IsObject()
    public users

    @IsString()
    public channel_source: string

    @IsNumber()
    public last_message_status: number

}