// import { Test, TestingModule } from '@nestjs/testing';
// import { ArticleController } from './article.controller';
// import { CreateArticleDto } from './dto/create-article.dto';
// import {Author} from "../author/entities/author.entity";
// import {CreateAuthorDto} from "../author/dto/create-author.dto";
// import {AuthorService} from "../author/author.service";
//
// describe('ArticleController', () => {
//   beforeEach(async () => {
//
//     // const module: TestingModule = await Test.createTestingModule({
//     //   controllers: [ArticleController],
//     //   // other providers and imports
//     // }).compile();
//
//
//     // module.get<ArticleController>(ArticleController);
//     // module.get<AuthorService>(AuthorService);
//   });
//
//   describe('createArticle', () => {
//     it('should create an article', () => {
//       const mockAuthor: Author = {
//         id: 'mockAuthorId',
//         name: 'Mock Author',
//         active: true,
//         articles: [],
//       };
//       const createArticleDto: CreateArticleDto = {
//         title: 'Article First Title',
//         description: 'Article First description',
//         author: mockAuthor,
//         published: new Date('2024-03-05T10:03:04.450Z'),
//         visible: true,
//       };
//
//       const result = ArticleController.create(createArticleDto)
//
//       // Add assertions as needed
//       expect(result).toBeDefined();
//       // Add more assertions based on your business logic
//     });
//   });
//
//   describe('updateArticle', () => {
//     it('should update an article', () => {
//       const articleId = '123'; // Replace with a valid article ID
//       const updateArticleDto: CreateArticleDto = {
//         title: 'Updated Article Title',
//         description: 'Updated Article description',
//         author: '2',
//         published: '2024-03-06T10:03:04.450Z',
//         visible: false,
//       };
//
//       const result = ArticleController.update(articleId, updateArticleDto);
//
//       // Add assertions as needed
//       expect(result).toBeDefined();
//       // Add more assertions based on your business logic for updating
//     });
//   });
//
//   describe('deleteArticle', () => {
//     it('should delete an article', () => {
//       const articleId = '123'; // Replace with a valid article ID
//
//       const result = ArticleController.remove(articleId);
//
//       // Add assertions as needed
//       expect(result).toBeDefined();
//       // Add more assertions based on your business logic for deleting
//     });
//   });
// });
