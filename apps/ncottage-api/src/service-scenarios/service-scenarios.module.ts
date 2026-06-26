import { Module } from "@nestjs/common";
import { ServiceScenariosController } from "./service-scenarios.controller.js";
import { ServiceScenariosService } from "./service-scenarios.service.js";

@Module({
    controllers: [ServiceScenariosController],
    providers: [ServiceScenariosService],
})
export class ServiceScenariosModule {}
