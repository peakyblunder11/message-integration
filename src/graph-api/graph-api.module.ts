import { Module } from '@nestjs/common';
import { GraphApiService } from './graph-api.service';

@Module({
  exports: [GraphApiService],
  providers: [GraphApiService]
})
export class GraphApiModule {}
