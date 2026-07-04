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
import { CertificatesService } from "./certificates.service.js";
import { CreateCertificateDto } from "./dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "./dto/update-certificate.dto.js";

@Controller("certificates")
export class CertificatesController {
    constructor(private readonly certificates: CertificatesService) {}

    @Get()
    list() {
        return this.certificates.list();
    }

    @Get(":slug")
    getOne(@Param("slug") slug: string) {
        return this.certificates.getBySlug(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateCertificateDto) {
        return this.certificates.create(dto);
    }

    @Patch(":slug")
    @UseGuards(JwtAuthGuard)
    update(@Param("slug") slug: string, @Body() dto: UpdateCertificateDto) {
        return this.certificates.update(slug, dto);
    }

    @Delete(":slug")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("admin")
    @HttpCode(204)
    remove(@Param("slug") slug: string) {
        return this.certificates.remove(slug);
    }
}
