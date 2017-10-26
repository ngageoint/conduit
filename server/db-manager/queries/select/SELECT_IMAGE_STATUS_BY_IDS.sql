SELECT
	"IMAGES_STATUS"."image_id"
FROM
	"conduit_db"."IMAGES_STATUS"
WHERE
	"IMAGES_STATUS"."article_id" = $1 AND "IMAGES_STATUS"."team_id" = $2;