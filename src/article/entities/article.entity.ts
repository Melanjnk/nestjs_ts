import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Author} from "../../author/entities/author.entity";
@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: string
    
    @Column()
    title: string
    
    @Column()
    description: string
    
    @CreateDateColumn()
    created: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    published: Date;

    @UpdateDateColumn()
    updated: Date

    @ManyToOne(() => Author, (author) => author.articles)
    @JoinColumn({name: 'author_id'})
    author: Author

    @Column()
    visible: boolean
}
