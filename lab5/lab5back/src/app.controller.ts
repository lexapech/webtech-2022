import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import DatabaseService from "./database.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private databaseService: DatabaseService) {}

  @Get()
  getHello(): string {
    return this.databaseService.select(()=>true,this.databaseService.tables['brokers'])
  }
}
