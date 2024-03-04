import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
  ValidationPipe, UsePipes
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {CacheInterceptor, CacheKey, CacheTTL} from "@nestjs/cache-manager";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

const TTL = 60; // Cache TTL in seconds

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('article'+':id')
  @CacheTTL(TTL)
  findOne(@Param('id') id: string) {
    return this.articleService.findCachedOne(id);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('articles_by_author__'+':authorId'+'_publish__'+':publish')
  @CacheTTL(TTL)
  findByPublishedAndByAuthor(
      @Query('authorId') authorId: string,
      @Query('published_since') publishedSince: string,
      @Query('published_until') publishUntil: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
  ) {
    return this.articleService.findCachedByPubDateAndAuthor(authorId, publishedSince, publishUntil, page, limit)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
