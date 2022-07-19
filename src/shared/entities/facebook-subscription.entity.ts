import { Entity,  Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
// @Unique(['userId'])
export class FacebookSubscription {
    // @PrimaryGeneratedColumn()
    // public id: number
    @Column({ type: 'varchar', length: 255, primary: true})
    public userId: string

    @Column({ type: 'varchar', length: 255 })
    public accessToken: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    public instanceId: string

    @Column('varchar', { array: true })
    public pages: string[]

    @Column({ type: 'varchar', length: 255 })
    public email: string

    @Column({ type: 'varchar', length: 255 })
    public fullName: string

    @Column({ type: 'varchar', length: 255, })
    public subId: string

    @CreateDateColumn({type: 'timestamp'})
    public createdAt: Date

    @UpdateDateColumn({type: 'timestamp'})
    public updatedAt: Date
}