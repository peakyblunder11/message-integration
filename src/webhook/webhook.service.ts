import { ConfigService } from '@nestjs/config'
import { HttpException, HttpStatus, Injectable, HttpCode } from '@nestjs/common';
import { In, Repository } from 'typeorm'
import { FacebookSubscription } from 'src/shared/entities/facebook-subscription.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { GraphApiService } from 'src/graph-api/graph-api.service'
import { RoomsService } from '../rooms/rooms.service';

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

                        // Sender Id : ID yang Berasal Dari sender yang mengirim pesan
                        // TODO: SELECT sub_id FROM ... where sender_id = senderId 
                        // Sender Id Bisa digunakan sebagai unique id yang digunakan untuk mencari sub id
                        // Sub ID Dipake untuk update create room atau update room

                        if ('message' in event) {
                            response = {
                                channel: 'Facebook',
                                entity: 'Message',
                                sender: event.sender.id,
                                recipient: event.recipient.id,
                                timestamp: event.timestamp,
                                message: event.message.text,
                            }
    
                            // const subId = await this.repository.query(
                            //     `SELECT * FROM facebook_subscription WHERE pages::text similar to '%${response.recipient}%'`
                            // )
    
                            const subscription = await
                                this.repository.createQueryBuilder('subs')
                                    .select()
                                    .where(`subs.pages::text SIMILAR TO '%${response.recipient}%'`)
                                    .getOne()
    
                            if (subscription) {
                                const subId = subscription.subId
                                const instanceId = subscription.instanceId
                                const accessToken = subscription.accessToken
                                const pages = subscription.pages
    
                                console.log('Initial Index', { subId, instanceId, accessToken, pages })

                                const senderProfile = await this.graphApi.getSenderProfile(accessToken, response.sender)

                                console.log(senderProfile)

                                // const data = {
                                //     phone_number: response.sender,
                                //     name: '',
                                //     phone_number_show: '',
                                //     profile_picture: '',
                                //     instance_id: instanceId,
                                //     sync_firestore: false,
                                //     unread_count: 0,
                                //     roomId: '',
                                //     assign_to: {},
                                //     pinned: false,
                                //     last_interaction: {},
                                //     archived: false,
                                //     room_status: '',
                                //     unreplied: '',
                                //     last_reply: '',
                                //     last_message: '',
                                //     lastMessage: {},
                                //     message_from_me: '',
                                //     roomName: '',
                                //     roomOwnerId: '',
                                //     subId,
                                //     users: {},
                                //     channel_source: '',
                                //     last_message_status: '',                                                                        
                                // }

                                // return await this.roomService.upsert(subId, instanceId, )
                            }
                            // Insert response to Message
                            // TODO: INSERT INTO subId_message (KEY) (VALUE)
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
     * --------------- Subscribe Webhook ------------------- 
     */
    async subscribe(userId) {
        return this.repository.findOne(userId)
    }

    /**
     * --------------- Register User to Webhook ---------------     
     */
    async register(query: {
        userAccessToken: string,
        subId: string,
        instanceId: string
    }) {
        const userAccessToken = query.userAccessToken

        if (!userAccessToken) throw new HttpException('User Access Token Cannot be Null', HttpStatus.BAD_REQUEST)
        if (!query.subId) throw new HttpException('Sub Id Token Cannot be Null', HttpStatus.BAD_REQUEST)
        if (!query.instanceId) throw new HttpException('Instance Id Cannot be Null', HttpStatus.BAD_REQUEST)
        
        console.log(query)
        try {
            const profile = await this.graphApi.getUserProfile(userAccessToken)
            const longAccessToken = await this.graphApi.generateLongAccessToken(userAccessToken)
            const pages = await this.graphApi.getUserPages(userAccessToken)
            const pageList = []

            if (pages) {
                pages.data.forEach(async (page) => {
                    try {
                        const subscribe = await this.graphApi.subscribeWebhook(page.id, page.access_token)
                        
                        pageList.push([page, subscribe])
                    } catch(e) {
                        return e
                    }
                });
            }

            const response = {
                userId: profile.id,
                fullName: profile.name,
                email: profile.email,
                instanceId: query.instanceId,
                accessToken: longAccessToken.access_token,
                subId: query.subId,
                pages: pageList
            }

            console.log(response)

            return response
            // ! Wakwaw Jangan DI HAPUS
            // const subscription = await this.repository.save(response)
            // return ({response, subscription})
        } catch (e) {
            return e
        }
    }

    async handleMessage(subId: string, pageId: string, pageAccessToken: string, response: any) {
        if (subId) {
            const subscription = await this.getUserPageList(response)
            const pages = subscription.pages 
        }

        return new HttpException('NOT FOUND', HttpStatus.NOT_FOUND)
    }

    async getUserPageList(response: any) {
            return this.repository.createQueryBuilder('subs')
                    .select(['subs.subId', 'subs.fullName', 'subs.pages'])
                    .where(`subs.pages::text SIMILAR TO '%${response.recipient}%'`)
                    .getOne()        
    }

    async testing (userAccessToken, userId) {
        const response = await this.graphApi.getSenderProfile(userAccessToken, userId)
        // const response = await this.graphApi.getUserProfile(userAccessToken)

        return response
    }

    async subscribePage(pageId: string, pageAccessToken: string) {
        return await this.graphApi.subscribeWebhook(pageId, pageAccessToken)
    }

}
