import { Module } from "@nestjs/common";
import { MediaModule } from "../media/media.module.js";
import { FilesController } from "./files.controller.js";

@Module({
    imports: [MediaModule],
    controllers: [FilesController],
})
export class FilesModule {}
