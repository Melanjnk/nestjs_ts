import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateAuthorDto} from './dto/create-author.dto';
import {UpdateAuthorDto} from './dto/update-author.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Author} from "./entities/author.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthorService {

    constructor(
        @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
    ) {
    }

    async create(createAuthorDto: CreateAuthorDto) {
        const author = await this.authorRepository.save({
            name: createAuthorDto.name,
            articles: createAuthorDto.articles,
            active: createAuthorDto.active
        })

        return {author};
    }

    async findAll(): Promise<Author[]> {
        try {
            return await this.authorRepository.find();
        } catch (err) {
            throw new NotFoundException();
        }
    }

    async findOne(id: number) {
        try {
            return await this.authorRepository.findOneOrFail({where: {id}})
        } catch (err) {
            throw new NotFoundException();
        }
    }

    update(id: number, updateAuthorDto: UpdateAuthorDto) {
        return `This action updates a #${id} author`;
    }

    remove(id: number) {
        return `This action removes a #${id} author`;
    }
}
