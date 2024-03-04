import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Article} from "../../article/entities/article.entity";

@Entity()
export class Author {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number
    
    @Column()
    name: string
    
    @Column()
    active: boolean
    
    @OneToMany(() => Article, (article) => article.author)
    articles: Article[]
}
