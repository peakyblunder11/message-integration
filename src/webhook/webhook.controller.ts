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

    @Get('subscribe') // localhost:5000/webhook/subscribe
    subscribeToWebhook(
        @Query() query: { userId: string }
    ) {
        return this.webhookService.subscribe(query.userId)
    }

    @Post('register')
    registerFacebook(
        @Query() query: {
            userAccessToken: string,
            subId: string,
            instanceId: string
        }
    ) {
        return this.webhookService.register(query)
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

}
