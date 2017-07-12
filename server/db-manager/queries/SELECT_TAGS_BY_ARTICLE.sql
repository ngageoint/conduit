SELECT
	"TAGS"."tag"
FROM
	"conduit-db"."TAGS"
WHERE
	"TAGS"."article_id" = $1;