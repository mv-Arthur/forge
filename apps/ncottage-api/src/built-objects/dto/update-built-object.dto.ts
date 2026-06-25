import { PartialType } from "@nestjs/mapped-types";
import { CreateBuiltObjectDto } from "./create-built-object.dto.js";

export class UpdateBuiltObjectDto extends PartialType(CreateBuiltObjectDto) {}
