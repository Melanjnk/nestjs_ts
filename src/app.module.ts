import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { AuthorModule } from './author/author.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
  imports: [UserModule, AuthorModule, ArticleModule, AuthModule, ConfigModule.forRoot({isGlobal: true}),
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              useFactory: (configSevice: ConfigService) => ({
                type: 'postgres',
                host: configSevice.get('DB_HOST'),
                port: configSevice.get('DB_PORT'),
                username: configSevice.get('DB_USER'),
                password: configSevice.get('DB_PASSWORD'),
                database: configSevice.get('DB_NAME'),
                synchronize: true,
                entities: [__dirname + '/**/*.entity{.js, .ts}'],
              }),
              inject: [ConfigService]
            }),
            CacheModule.register({isGlobal: true}),
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
