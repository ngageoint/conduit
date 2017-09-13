SELECT
	"IMAGES"."uri"
FROM
	"conduit_db"."IMAGES"
WHERE
	"IMAGES"."article_id" = $1;