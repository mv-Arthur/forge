import { PartialType } from "@nestjs/mapped-types";
import { CreateServiceScenarioDto } from "./create-service-scenario.dto.js";

export class UpdateServiceScenarioDto extends PartialType(
    CreateServiceScenarioDto
) {}
