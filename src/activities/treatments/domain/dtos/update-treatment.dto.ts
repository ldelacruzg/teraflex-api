import { PickType } from "@nestjs/swagger";
import { CreateTreatmentDto } from "./create-treament.dto";

export class UpdateTreatmentDto extends PickType(CreateTreatmentDto, ['title', 'description']) {}