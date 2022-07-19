import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateSubscriptionDto {

    @IsString()
    @IsNotEmpty()
    public userId: string

    @IsString()
    @IsNotEmpty()
    public accessToken: string
    
    @IsEmail()
    public email: string

    @IsString()
    @IsNotEmpty()
    public fullName: string

    @IsString()
    @IsNotEmpty()
    public subId: string
}