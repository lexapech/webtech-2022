import {Controller, Get, Query, Res} from '@nestjs/common';
import { Response } from 'express';
import {StocksService} from "./stocks.service";

@Controller('api/stocks')
export class StocksController {
    constructor(private stocksService: StocksService) {}

    @Get('all')
    getStocks(): string {
        return this.stocksService.getAll()
    }
    @Get('dates')
    getDates(): { min:Date,max:Date } {
        return this.stocksService.getDateRange()
    }
    @Get('details')
    getDetails(@Query('code') code:string,@Res() res: Response) {
        let result = this.stocksService.getDetails(code)
        if (result)
            res.end(JSON.stringify(result))
        else
            res.status(400)
    }
}