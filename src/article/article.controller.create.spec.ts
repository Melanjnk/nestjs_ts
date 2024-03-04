import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { CreateArticleDto } from './dto/create-article.dto';
import {Article} from "./entities/article.entity";
import {Author} from "../author/entities/author.entity";
import {UpdateArticleDto} from "./dto/update-article.dto";

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
                        set: jest.fn(),
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    describe('create', () => {
        it('should create an article and set it to cache', async () => {
            // Arrange
            const createArticleDto: CreateArticleDto = {
                title: 'Test Article',
                description: 'This is a test article.',
                author: new Author(),
                visible: true,
                published: new Date(),
            };

            const mockArticle = {
                id: '1',
                ...createArticleDto,
            };

            // Mock the repository save method
            jest.spyOn(articleRepository, 'save').mockImplementation(async (entity: DeepPartial<Article>) => {
                return {
                    id: mockArticle.id,
                    ...entity,
                } as Article; // Ensure the returned object matches the Article type
            });

            // Mock the cacheManager set method
            jest.spyOn(cacheManager, 'set').mockImplementation(async () => undefined);

            // Act
            const result = await service.create(createArticleDto);

            // Assert
            expect(result).toEqual({ article: mockArticle });

            // Check if the repository save method was called with the correct parameters
            expect(articleRepository.save).toHaveBeenCalledWith({
                title: createArticleDto.title,
                description: createArticleDto.description,
                author: createArticleDto.author,
                visible: createArticleDto.visible,
                published: createArticleDto.published,
            });

            // Check if the cacheManager set method was called with the correct parameters
            expect(cacheManager.set).toHaveBeenCalledWith('article' + mockArticle.id, {
                id: mockArticle.id,
                ...createArticleDto,
            });
        });
    });
});
