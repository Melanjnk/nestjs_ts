import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {Article} from "./entities/article.entity";

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
                        reset: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
        articleRepository = module.get<Repository<Article>>(getRepositoryToken(Article));
        cacheManager = module.get<Cache>(CACHE_MANAGER);
    });

    describe('remove', () => {
        it('should update article to invisible, reset cache, and return result', async () => {
            // Arrange
            const articleId = '1';

            const mockUpdateResult = {
                raw: [], // Add appropriate raw data
                generatedMaps: [], // Add appropriate generated maps data
                affected: 1,
            } as UpdateResult;

            // Mock the repository update method
            jest.spyOn(articleRepository, 'update').mockResolvedValue(mockUpdateResult);

            // Mock the cacheManager reset method
            jest.spyOn(cacheManager, 'reset').mockImplementation(async () => undefined);

            // Act
            const result = await service.remove(articleId);

            // Assert
            expect(result).toEqual(mockUpdateResult);

            // Check if the repository update method was called with the correct parameters
            expect(articleRepository.update).toHaveBeenCalledWith({ id: articleId }, { visible: false });

            // Check if the cacheManager reset method was called
            expect(cacheManager.reset).toHaveBeenCalled();
        });
    });
});
