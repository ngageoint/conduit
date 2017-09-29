SELECT
	"BOOKS"."id",
	"BOOKS"."name"
FROM
	"conduit_db"."BOOKS"
WHERE
	"BOOKS"."team_id" = $1;