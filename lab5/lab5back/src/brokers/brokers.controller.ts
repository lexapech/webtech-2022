import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {Response } from 'express';
import {BrokersService} from "./brokers.service";

export interface IBroker {
    name:string,
    funds:number
}

@Controller('api/brokers')
export class BrokersController {
    constructor(private brokersService: BrokersService) {}

    @Get('all')
    getBrokers(): string {
        return this.brokersService.getAll()
    }
    @Post('new')
    addBroker(@Body() body: IBroker,@Res() res:Response) {
        if(!body || !body.name || !body.funds) return res.status(400)
        this.brokersService.add(body)
        return res.status(200)
    }
    @Post('delete')
    deleteBroker(@Body() body: { name:string },@Res() res:Response) {
        if(!body || !body.name) return res.status(400)
        this.brokersService.delete(body.name)
        return res.status(200)
    }
}