import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { UpdateReviewDto } from "./dto/update-review.dto.js";
import { ReviewsService } from "./reviews.service.js";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviews: ReviewsService) {}

    @Get()
    list() {
        return this.reviews.list();
    }

    @Get(":id")
    getOne(@Param("id") id: string) {
        return this.reviews.getById(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateReviewDto) {
        return this.reviews.create(dto);
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(@Param("id") id: string, @Body() dto: UpdateReviewDto) {
        return this.reviews.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("id") id: string) {
        return this.reviews.remove(id);
    }
}
