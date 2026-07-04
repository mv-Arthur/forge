import { Module } from "@nestjs/common";
import { ProjectSelectionsController } from "./project-selections.controller.js";
import { ProjectSelectionsService } from "./project-selections.service.js";

@Module({
    controllers: [ProjectSelectionsController],
    providers: [ProjectSelectionsService],
})
export class ProjectSelectionsModule {}
