SELECT
	"IMAGES"."uri"
FROM
	"conduit-db"."IMAGES"
WHERE
	"IMAGES"."article_id" = $1;