import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';


@Controller('reviews')
export class ReviewsController {
constructor(private reviewsService: ReviewsService) {}


@Post()
create(@Body() body: any) {
return this.reviewsService.create(body);
}


@Get('driver/:id')
getByDriver(@Param('id') id: string) {
return this.reviewsService.findForDriver(id);
}
}