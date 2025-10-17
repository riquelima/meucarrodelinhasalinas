import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
    constructor(private routesService: RoutesService) { }


    @Post()
    create(@Body() body: any) {
        return this.routesService.create(body);
    }


    @Get('search')
    search(@Query('origin') origin: string, @Query('destination') destination: string) {
        return this.routesService.findMatches(origin, destination);
    }
}