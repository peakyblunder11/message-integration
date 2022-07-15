import { ConfigService } from '@nestjs/config'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class WebhookService {

    constructor(
        private configService: ConfigService
    ) { }

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
            if (mode === 'subscribe' && token === this.configService.get('WEBHOOK_VERIFY_TOKEN')) {
                console.log('Webhook Verified')
                return challenge
            }
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
    }

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
                    entry.messaging.forEach((event) => {
                        response = {
                            channel: 'Facebook',
                            entity: 'Message',
                            sender: event.sender.id,
                            recipient: event.recipient.id,
                            timestamp: event.timestamp,
                            message: event.message.text,
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

    async subscribe(pageId, pageAccessToken) {
        try {
            const response = await axios.post(`https://graph.facebook.com/${pageId}/subscribed_apps?subscribed_fields=feed,messages&access_token=${pageAccessToken}`)

            return response.data
        } catch (e) {
            return e
        }
    }
}
