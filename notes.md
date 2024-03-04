
adminer:
image: adminer
restart: always
ports:
- 8080:8080

            // .leftJoinAndSelect("author_id", "author")
            // .where("author = :authorId", {authorId: authorId})
            // .select(["article.title", "author.name", "author.id"])
            // .execute()
        // const author = this.articleRepository.findBy({
        //     where: {authorId: authorId}
        // })
"publishedDate": "'$(date -d 'tomorrow' +'%Y-%m-%dT%H:%M:%S')'",


curl -X POST http://localhost:3000/articles -H "Content-Type: application/json" -d '{
"title": "Your Article Title",
"content": "Your Article Content",
"publishedDate": "'$(node -e "console.log(require('date-fns').format(new Date(Date.now() + 86400000), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'))")'",
"authorId": 1
}'
