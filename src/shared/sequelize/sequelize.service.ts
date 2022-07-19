import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    @Inject(ConfigService)
    private readonly config: ConfigService

    public createSequelizeOptions(): SequelizeModuleOptions {
        return {
            dialect: 'postgres',
            host: this.config.get<string>('DATABASE_HOST'),
            port: this.config.get<number>('DATABASE_PORT'),
            username: this.config.get<string>('DATABASE_USER'),
            password: this.config.get<string>('DATABASE_PASSWORD'),
            schema: this.config.get<string>('DATABASE_SCHEMA'),
            autoLoadModels: false,
            synchronize: false
        }
    }
}