import { Module } from "@nestjs/common";
import { BuiltObjectsController } from "./built-objects.controller.js";
import { BuiltObjectsService } from "./built-objects.service.js";

@Module({
    controllers: [BuiltObjectsController],
    providers: [BuiltObjectsService],
})
export class BuiltObjectsModule {}
