import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string
    
    @IsEmail()
    email: string
    
    @MinLength(6, {message: 'Must be more then 6 symbols'})
    password: string
}
