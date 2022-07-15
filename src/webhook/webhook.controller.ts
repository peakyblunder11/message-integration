import { Controller, Get, Post, Query, Body, HttpCode } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {

    constructor(private webhookService: WebhookService) {}

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

    @Post('subscribe')
    subscribeToWebhook(
        @Query() query: {
            pageId: string,
            pageAccessToken: string
        }
    ) {
        return this.webhookService.subscribe(query.pageId, query.pageAccessToken)
    }

}
