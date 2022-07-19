import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class MessageEntity {
    
    @PrimaryGeneratedColumn({ type: 'bigint' })
    public id: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    public chatId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    public dbRoomId: string

    @Column({ type: 'text', nullable: true })
    public content: string 

    @Column({ type: 'json', nullable: true })
    public files: string
    
    @Column({ type: 'json', nullable: true })
    public original_message: string
    
    @Column({ type: 'json', nullable: true })
    public data: string
    
    @Column({ type: 'boolean', nullable: true })
    public fromMe: boolean
    
    @Column({ type: 'boolean', nullable: true })
    public deleted: boolean
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    public sender_id: string
    
    @Column({ type: 'varchar', nullable: true })
    public sender_name: string
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    public source_id: string
    
    @Column({ type: 'json', nullable: true })
    public timestamp: string
    
    @Column({ type: 'boolean', nullable: true })
    public distributed: boolean
    
    @Column({ type: 'boolean', nullable: true })
    public seen: boolean
    
    @Column({ type: 'json', nullable: true })
    public seen_by: string
    
    @Column({ type: 'json', nullable: true })
    public replyMessage: string
    
    @Column({ type: 'text', nullable: true })
    public content_notification: string
    
    @Column({ type: 'bigint', nullable: true })
    public couch_timestamp
    
    @CreateDateColumn({ type: 'timestamptz', nullable: true })
    public createdAt: Date
    
    @UpdateDateColumn({ type: 'timestamptz', nullable: true })
    public updatedAt: Date
}