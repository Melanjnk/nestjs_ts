import {Article} from "../../article/entities/article.entity";
import {IsBoolean, IsNotEmpty} from "class-validator";

export class CreateAuthorDto {
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    articles: Article[] | []
    @IsBoolean()
    active: boolean
}
