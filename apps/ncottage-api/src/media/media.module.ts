import { Module } from "@nestjs/common";
import { MediaPublicController } from "./media-public.controller.js";
import { MediaController } from "./media.controller.js";
import { MediaService } from "./media.service.js";
import { StorageService } from "./storage.service.js";

@Module({
    controllers: [MediaController, MediaPublicController],
    providers: [MediaService, StorageService],
})
export class MediaModule {}
