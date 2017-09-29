SELECT
	"TAGS"."tag"
FROM
	"conduit_db"."TAGS"
WHERE
	"TAGS"."tag" = $1 AND "TAGS"."article_id" = $2;