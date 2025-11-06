import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-reviews.dto';



@ApiBearerAuth()
@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
constructor(private reviewsService: ReviewsService) {}


@Post()
create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
}


@Get('driver/:id')
getByDriver(@Param('id') id: string) {
return this.reviewsService.findForDriver(id);
}

@Get('user/:id')
getByReceiver(@Param('id') id: string) {
return this.reviewsService.findByReceiver(id);
}
}