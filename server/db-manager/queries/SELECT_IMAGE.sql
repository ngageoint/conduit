SELECT
	"IMAGES"."uri"
FROM
	"conduit-db"."IMAGES"
WHERE
	"IMAGES"."id" = $1;