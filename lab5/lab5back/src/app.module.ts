import {ConsoleLogger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DatabaseService from "./database.service";
import {BrokersController} from "./brokers/brokers.controller";
import {StocksController} from "./stocks/stocks.controller";
import {BrokersService} from "./brokers/brokers.service";
import {StocksService} from "./stocks/stocks.service";

@Module({
  imports: [],
  controllers: [AppController,BrokersController,StocksController],
  providers: [AppService,DatabaseService,ConsoleLogger,BrokersService,StocksService],
})
export class AppModule {}
