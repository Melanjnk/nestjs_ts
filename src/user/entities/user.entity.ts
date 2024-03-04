import {Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Article} from "../../article/entities/article.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number
    
    @Column({name: 'email', unique: true})
    email: string
    
    @Column({name: 'password'})
    password: string
    
    @Column({name: 'username'})
    username: string
    
    @CreateDateColumn()
    created: Date
    
    // @UpdateDateColumn()
    // updated: string
    
}
