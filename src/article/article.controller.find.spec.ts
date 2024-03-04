import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import {Article} from "./entities/article.entity";
import {Author} from "../author/entities/author.entity";

describe('ArticleService', () => {
    let service: ArticleService;
    let articleRepository: Repository<Article>;
    let cacheManager: Cache;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: getRepositoryToken(Article),
                    useClass: Repository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    describe('findCachedOne', () => {
        it('should return article from cache if present', async () => {
            // Arrange
            const articleId = '1';
            // Mock the console.error method
            const consoleErrorSpy = jest.spyOn(console, 'error');
            const cachedArticle = {
                id: articleId,
                title: 'Test Article',
                description: 'This is a test article.',
                author: {},//new Author(),
                visible: true,
                published: new Date(),
                // Add other fields as needed
            };

            // Mock the cacheManager get method
            jest.spyOn(cacheManager, 'get').mockResolvedValue(JSON.stringify(cachedArticle));

            // Act
            const result = await service.findCachedOne(articleId);

            // Assert
            expect(result).toEqual({
                ...cachedArticle,
                published: new Date(cachedArticle.published).toISOString(),
            });
        });

        it('should return article from repository and set in cache if not present', async () => {
            // Arrange
            const articleId = '1';
            const nonCachedArticle: Article = {
                id: articleId,
                title: 'Test Article',
                description: 'This is a test article.',
                created: new Date(),
                published: new Date(),
                updated: new Date(),
                author: new Author(),
                visible: true,
                // Add other fields as needed
            };

            // Mock the cacheManager get method to return null (article not in cache)
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

            // Mock the repository findOneOrFail method
            jest.spyOn(articleRepository, 'findOneOrFail').mockResolvedValue(nonCachedArticle);

            // Mock the cacheManager set method
            jest.spyOn(cacheManager, 'set').mockImplementation(async () => undefined);

            // Act
            const result = await service.findCachedOne(articleId);

            // Assert
            expect(result).toEqual(nonCachedArticle);

            // Ensure repository findOneOrFail method and cacheManager set method were called with the correct parameters
            expect(articleRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: articleId } });
            expect(cacheManager.set).toHaveBeenCalledWith(`article:${articleId}`, JSON.stringify(nonCachedArticle));
        });


        it('should throw NotFoundException if article not found in repository', async () => {
            // Arrange
            const articleId = '1';

            // Mock the cacheManager get method to return null (article not in cache)
            jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

            // Mock the repository findOneOrFail method to throw NotFoundException
            jest.spyOn(articleRepository, 'findOneOrFail').mockRejectedValue(new NotFoundException());

            // Act and Assert
            await expect(service.findCachedOne(articleId)).rejects.toThrowError(NotFoundException);

            // Ensure cacheManager set method was not called
            expect(cacheManager.set).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if cacheManager throws an error', async () => {
            // Arrange
            const articleId = '1';
            const consoleErrorSpy = jest.spyOn(console, 'error');

            // Mock the cacheManager get method to throw an error
            jest.spyOn(cacheManager, 'get').mockRejectedValue(new Error('Cache error'));

            // Act and Assert
            await expect(service.findCachedOne(articleId)).rejects.toThrowError(NotFoundException);
        });

    });
});
