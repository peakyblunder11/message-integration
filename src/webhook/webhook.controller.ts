import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook') // localhost:5000/webhook
export class WebhookController {

    constructor(
        private webhookService: WebhookService
    ) { }

    @Get()
    @HttpCode(200)
    getWebhook(
        @Query() query: {
            "hub.mode": string,
            "hub.verify_token": string,
            "hub.challenge": string
        }
    ) {
        return this.webhookService.get(query)
    }

    @Post()
    postWebhook(
        @Body() body
    ) {
        return this.webhookService.post(body)
    }

    @Post('subscribe') // localhost:5000/webhook/subscribe
    subscribeToWebhook(
        @Query() query: { pageId: string, pageAccessToken: string }
    ) {
        return this.webhookService.subscribePage(query.pageId, query.pageAccessToken)
    }

    @Post('register')
    registerFacebook(
        @Query() query: {
            userAccessToken: string
        },
        @Body() body: {
            subId: string,
            instanceId: any,
            page: {
                id: string,
                accessToken: string,
                name: string
            }
        }
    ) {
        return this.webhookService.register(query, body)
    }

    @Get('test')
    testing(
        @Query() query: {
            userAccessToken: string,
            userId: string
        }
    ) {
        return this.webhookService.testing(query.userAccessToken, query.userId)
    }

    @Post('send-message')
    send(
        @Body() body: { from: string, to: string, platform: string, message: string, pageAccessToken: string, subId: string, instanceId: string },
        @Query() query: { instanceId: string, subId: string }
    ) {
        return this.webhookService.sendMessage(body, query)
    }

}
