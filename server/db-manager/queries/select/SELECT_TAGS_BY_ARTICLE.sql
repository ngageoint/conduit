SELECT
	"TAGS"."tag"
FROM
	"conduit_db"."TAGS"
WHERE
	"TAGS"."article_id" = $1;