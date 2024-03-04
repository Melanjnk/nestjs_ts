import {Author} from "../../author/entities/author.entity";
import {IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsString} from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    title: string
    
    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    author: Author

    @IsBoolean()
    visible: boolean // not delete change this flag

    @IsString()
    @IsDate()
    published: Date;
}
