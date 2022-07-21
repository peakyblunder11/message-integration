import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class RoomEntity {

    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: number

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public phone_number: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public name: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public phone_number_show: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public profile_picture: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public instance_id: string

    @Column({ type: 'boolean', nullable: true })
    public sync_firestore: boolean

    @Column({ type: 'int', nullable: true })
    public unread_count: number

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public roomId: string

    @Column({ type: 'jsonb', nullable: true })
    public assign_to

    @Column({ type: 'boolean', nullable: true, default: false })
    public pinned: boolean

    @Column({ type: 'jsonb', nullable: true })
    public last_interaction

    @Column({ type: 'boolean', nullable: true, default: false })
    public archived: boolean

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public roomStatus: string

    @Column({ type: 'boolean', nullable: true, default: false })
    public unreplied: boolean

    @Column({ type: 'bigint', nullable: true })
    public last_reply: number

    @Column({ type: 'bigint', nullable: true })
    public last_message: number

    @Column({ type: 'jsonb', nullable: true })
    public lastMessage

    @Column({ type: 'bigint', nullable: true })
    public message_from_me: number

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public roomName: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public roomOwnerId: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public roomOwnerName: string

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public subId: string

    @Column({ type: 'jsonb', nullable: true })
    public users

    @Column({ type: 'varchar', nullable: true, length: 255 })
    public channel_source: string

    @Column({ type: 'int', nullable: true })
    public last_message_status: number

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    public createdAt: Date

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    public updatedAt: Date

}