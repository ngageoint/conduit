SELECT
	"ARTICLES_STATUS"."removed"
FROM
	"conduit_db"."ARTICLES_STATUS"
WHERE
	"ARTICLES_STATUS"."article_id" = $1 AND "ARTICLES_STATUS"."team_id" = $2;