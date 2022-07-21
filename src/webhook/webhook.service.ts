import { ConfigService } from '@nestjs/config'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { FacebookSubscription } from 'src/shared/entities/facebook-subscription.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { GraphApiService } from 'src/graph-api/graph-api.service'
import { RoomsService } from '../rooms/rooms.service'
import { RoomEntity } from '../shared/entities/rooms.entity';

@Injectable()
export class WebhookService {
    @InjectRepository(FacebookSubscription)
    private readonly repository: Repository<FacebookSubscription>

    private appId
    private appSecret
    private baseApi
    private verifyToken

    constructor(
        private configService: ConfigService,
        private graphApi: GraphApiService,
        private roomService: RoomsService
    ) {
        this.appId = configService.get('FACEBOOK_APP_ID')
        this.appSecret = configService.get('FACEBOOK_APP_SECRET')
        this.baseApi = `${configService.get('FACEBOOK_API_URL')}/${configService.get('FACEBOOK_API_VER')}`
        this.verifyToken = configService.get('WEBHOOK_VERIFY_TOKEN')
    }

    /**
     *  -------------- Register Webhook --------------
     */
    get(
        query: {
            'hub.mode': string,
            'hub.verify_token': string,
            'hub.challenge': string,
        }
    ): any {
        const mode = query['hub.mode']
        const token = query['hub.verify_token']
        const challenge = query['hub.challenge']

        if (mode && token) {
            if (mode === 'subscribe' && token === this.verifyToken) {
                console.log('Webhook Verified')
                return challenge
            }
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
    }

    /**
     *  -------------- Get Webhook Response -----------
     */
    post(body) {
        // Recipient id can be used for unique receiver
        let response: {
            channel: string,
            entity: string,
            sender: number
            recipient: number,
            timestamp: string,
            message: string
        }

        if (body.object === 'page') {

            body.entry.forEach((entry) => {
                if ('changes' in entry) {
                    if (entry.changes[0].field === 'feed') {
                        const change = entry.changes[0].value
                        if (change.item === 'post') console.log('Incoming Post')
                        if (change.item === 'comment') console.log('Incoming Message')
                    }
                }

                if ('messaging' in entry) {
                    entry.messaging.forEach(async (event) => {
                        if ('message' in event) {
                            response = {
                                channel: 'Facebook',
                                entity: 'Message',
                                sender: event.sender.id,
                                recipient: event.recipient.id,
                                timestamp: event.timestamp,
                                message: event.message.text,
                            }
                            
                            const messageId = event.message.mid
                            const subs = await this.repository.findOne({
                                where: {
                                    pageId: response.recipient.toString()
                                }
                            })
                            
                            if (subs) {
                                console.log(subs)

                                const instanceId = subs.instanceId
                                const subId = subs.subId
                                const date = new Date()
                                const timestamp = date.getTime()

                                const room = await this.roomService.getRoom(subId, instanceId, response.sender.toString())

                                const data = {
                                    phone_number: response.sender,
                                    name: response.sender,
                                    phone_number_show: response.sender,
                                    profile_picture: response.sender,
                                    instance_id: instanceId,
                                    sync_firestore: false,
                                    unread_count: 0,
                                    roomId: `${instanceId}-${response.sender}`,
                                    pinned: false,
                                    last_interaction: null,
                                    assign_to: null,
                                    archived: false,
                                    roomStatus: "on_queue",
                                    unreplied: true,
                                    last_reply: 0,
                                    last_message: 0,
                                    lastMessage: {
                                        data: {},
                                        seen: false,
                                        files: [],
                                        fromMe: false,
                                        content: response.message,
                                        seen_by: [],
                                        sender_id: response.sender,
                                        source_id: messageId,
                                        timestamp: {
                                            _seconds: 1657619067,
                                            _nanoseconds: 0
                                        },
                                        distributed: true,
                                        sender_name: response.sender,
                                        original_message: {
                                            id: messageId,
                                            type: "message_create",
                                            message_create: {
                                                target: {
                                                    recipient_id: response.recipient
                                                },
                                                sender_id: response.sender,
                                                message_data: {
                                                    text: response.message,
                                                    entities: {
                                                        urls: [],
                                                        symbols: [],
                                                        hashtags: [],
                                                        user_mentions: []
                                                    }
                                                }
                                            },
                                            created_timestamp: timestamp
                                        },
                                        "content_notification": "New Incoming Message"
                                    },
                                    message_from_me: 0,
                                    roomName: response.sender,
                                    roomOwnerId: response.recipient,
                                    roomOwnerName: response.recipient,
                                    subId: subId,
                                    users: [
                                        {
                                            _id: response.recipient,
                                            avatar: "wakwaw",
                                            status: null,
                                            username: response.recipient
                                        },
                                        {
                                            _id: response.sender,
                                            avatar: 'blahbloh',
                                            status: null,
                                            username: response.sender
                                        }
                                    ],
                                    channel_source: 'Facebook',
                                    last_message_status: null,
                                }

                                console.log(room)

                                if (room.length) {
                                    console.log(room)
                                    const update = await this.roomService.updateRoom(subId, instanceId, data)

                                    console.log(update)
                                    return update
                                } else {
                                    console.log('Room Empty, Insert Data Instead')
                                    const insert = await this.roomService.saveRoom(subId, data)
                                    
                                    console.log(insert)
                                    return insert
                                }
                            }
                        }


                        // Got a read event
                        if ('read' in event) return console.log('Got a read message')
                        // Got a deliver event
                        if ('delivery' in event) return console.log('Got a delivery message')

                        console.table({
                            event: response
                        })
                    })
                }
            });

            // Don't Delete 
            return new HttpException('Event Received', HttpStatus.OK)
        }

        if (body.object === 'instagram') {

            body.entry.forEach((entry) => {

                if ('changes' in entry) {
                    entry.changes.forEach(event => {
                        if (event.field === 'comments') return console.log('Comment')
                        if (event.field === 'mentions') return console.log('Mentions')
                    });
                }

                if ('messaging' in entry) {
                    console.log('Pesan masuk')
                    entry.messaging.forEach(event => {
                        console.log(event)
                    });
                }
            })

            return new HttpException('Instagram Event Received', HttpStatus.OK)
        }

        throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }    

    /**
     * 
     * @param query 
     * @param body 
     * @returns Profile, Long Access Token, Page and Instance Id
     *  
     */
    async register(
        query: {
            userAccessToken: string,

        },
        body: {
            subId: string,
            instanceId: string,
            page: {
                id: string,
                accessToken: string,
                name: string
            }
        }
    ) {
        const userAccessToken = query.userAccessToken
        const instanceId = body.instanceId
        const subId = body.subId
        const page = body.page

        console.log({ userAccessToken, instanceId, subId, page })

        try {
            const profile = await this.graphApi.getUserProfile(userAccessToken)
            const longAccessToken = await this.graphApi.generateLongAccessToken(userAccessToken)

            const data = {
                instanceId,
                subId,
                userId: profile.id,
                userAccessToken: longAccessToken.access_token,
                pageId: page.id,
                pageAccessToken: page.accessToken,
                pageName: page.name,
                ownerName: profile.name,
            }

            const subscribePage = await this.graphApi.subscribeWebhook(data.pageId, data.pageAccessToken)

            const subs = await this.repository.save(data)

            console.log({
                data
            })

            return { profile, longAccessToken, page, instanceId, subscribePage, subs }
        } catch (e) {
            return e
        }
    }

    // Handling Function
    async handleMessage(subId: string, pageId: string, pageAccessToken: string, response: any) {
        return { subId, pageId, pageAccessToken, response }
    }

    async getUserPageList(response: any) {
        return this.repository.createQueryBuilder('subs')
            .select(['subs.subId', 'subs.fullName', 'subs.pages'])
            .where(`subs.pages::text SIMILAR TO '%${response.recipient}%'`)
            .getOne()
    }

    async testing(userAccessToken, userId) {
        const response = await this.graphApi.getSenderProfile(userAccessToken, userId)
        // const response = await this.graphApi.getUserProfile(userAccessToken)

        return response
    }

    async subscribePage(pageId: string, pageAccessToken: string) {
        return await this.graphApi.subscribeWebhook(pageId, pageAccessToken)
    }

    async sendMessage(
        body: { from: string, to: string, platform: string, message: string, pageAccessToken: string, subId: string, instanceId: string },
        query: { instanceId: string, subId: string }

    ) {
        try {
            const message = await this.graphApi.sendMessage(body.from, body.to, body.platform, body.message, body.pageAccessToken)

            if ('recipient_id' in message) {
                const room = await this.roomService.getRoom(query.subId, query.instanceId, body.to)

                // const data: RoomEntity = this.insertRoomData(query, body)

                if (room) {
                    // await this.roomService.updateRoom(query.subId, query.instanceId, data)
                } else {
                    // await this.roomService.saveRoom(query.subId, data)
                }
            }

            return

        } catch (e) {
            return e
        }
    }

}
