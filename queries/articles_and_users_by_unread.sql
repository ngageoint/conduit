SELECT articles.id, users.name_preferred FROM "conduit-db".articles
INNER JOIN "conduit-db".articles_status ON articles.id = articles_status.article_id
INNER JOIN "conduit-db".users ON users.id = articles_status.user_id
WHERE articles_status.read = FALSE