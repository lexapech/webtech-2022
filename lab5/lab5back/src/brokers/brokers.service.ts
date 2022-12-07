import { Injectable } from '@nestjs/common';
import DatabaseService from "../database.service";
import {IBroker} from "./brokers.controller";

@Injectable()
export class BrokersService {
    constructor(private databaseService: DatabaseService) {
    }
    getAll() {
        return this.databaseService.select(()=>true,this.databaseService.tables['brokers'])
    }
    add(broker: IBroker){
        this.databaseService.insert(broker,this.databaseService.tables['brokers'])
    }
    update(broker: IBroker) {
        this.databaseService.update({funds: broker.funds},(row:any)=>row.name===broker.name,this.databaseService.tables['brokers'])
    }

    delete(name:string) {
        this.databaseService.delete((x)=>x.name===name,this.databaseService.tables['brokers'])
    }
}