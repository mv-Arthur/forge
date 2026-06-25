import { PartialType } from "@nestjs/mapped-types";
import { CreateFaqItemDto } from "./create-faq-item.dto.js";

export class UpdateFaqItemDto extends PartialType(CreateFaqItemDto) {}
