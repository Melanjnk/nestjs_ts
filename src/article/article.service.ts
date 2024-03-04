import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateArticleDto} from './dto/create-article.dto';
import {UpdateArticleDto} from './dto/update-article.dto';
import {Repository} from "typeorm";
import {Article} from "./entities/article.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Cache} from 'cache-manager';
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import * as util from "util";

@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
    }

    async create(createArticleDto: CreateArticleDto) {
        const article = await this.articleRepository.save({
            title: createArticleDto.title,
            description: createArticleDto.description,
            author: createArticleDto.author,
            visible: createArticleDto.visible,
            published: createArticleDto.published
        })
        await this.cacheManager.set('article' + article.id, article);
        const cachedData = await this.cacheManager.get('article' + article.id)
        console.log('data set to cache', cachedData);
        return {article}
    }

    async findCachedOne(id: string) {
        let cacheKey = util.format('article:%s', id);
        try {
            const cachedArticle = await this.cacheManager.get(cacheKey)
            if (cachedArticle) {
                return JSON.parse(<string>cachedArticle);
            }

            try {
                const article = await this.articleRepository.findOneOrFail({where: {id: id}})
                const jsonArticles = JSON.stringify(article)
                await this.cacheManager.set(cacheKey, jsonArticles);
                return article
            } catch (err) {
                throw new NotFoundException();
            }
        } catch (e) {
            console.error(`Error while retrieving article #${id} from Redis cache:`, e);
            throw new NotFoundException(`Article #${id} not found`);
        }
    }

    async findCachedByPubDateAndAuthor(authorId?: string,
                                       pubDate?: string,
                                       page: number = 1,
                                       limit: number = 10,) {
        const articlesQuery = this.articleRepository.createQueryBuilder("article")
            .leftJoinAndSelect('article.author', 'author')
            .where('article.visible = :visible', {visible: true})
        if (authorId) {
            articlesQuery.andWhere('article.author_id = :authorId', {authorId})
        }
        if (pubDate) {
            articlesQuery.andWhere('article.published = :pubDate', {pubDate})
        }
        let cacheKey = 'all_article';
        if (authorId) {
            cacheKey = util.format('all_article:%s', authorId);
        }
        if (pubDate) {
            cacheKey += "_" + util.format('%s', pubDate)
        }

        try {
            // Attempt to retrieve articles from Redis cache
            const cachedArticles = await this.cacheManager.get(cacheKey)
            if (cachedArticles) {
                // If cached articles exist, return them
                return JSON.parse(<string>cachedArticles);
            }
            const [articles, total] = await articlesQuery
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            const jsonArticles = JSON.stringify(articles)
            await this.cacheManager.set(cacheKey, jsonArticles);

            if (total === 0) {
                throw new NotFoundException();
            }
            return {
                data: articles,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (e) {
            console.error('Error while retrieving articles from Redis cache:', e);
            throw new NotFoundException('Articles not found');
        }

    }

    async update(id: string, updateArticleDto: UpdateArticleDto) {
        if (updateArticleDto.visible === false) {
            return 'ERROR: use DELETE, if you wanna hide element'
        }
        const result = await this.articleRepository.update({id: id}, updateArticleDto)
        if (result) {
            // we don't wanna kill immediately whole cache, because one field was change
            await this.cacheManager.del('article' + id);
        }
        return result
    }

    async remove(id: string) {
        const result = await this.articleRepository.update({id: id}, {visible: false})
        if (result) {
            // just for example: if we wanna remove, and invalidate only article/:id we could use cacheManager.del()
            // const cachedData = await this.cacheManager.del('article' + id)
            // but here better use reset to invalidate the full cache, to refresh data for all selected queries such as findAll, findBy, findOne etc
            await this.cacheManager.reset();
        }
        return result
    }
}
