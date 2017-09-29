SELECT
	"IMAGES"."uri"
FROM
	"conduit_db"."IMAGES"
WHERE
	"IMAGES"."uri" = $1 AND "IMAGES"."article_id" = $2;