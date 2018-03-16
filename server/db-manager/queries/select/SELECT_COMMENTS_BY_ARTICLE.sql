SELECT
	"COMMENTS"."user_id",
	"USERS"."name_preferred",
	"COMMENTS"."date",
	"COMMENTS"."text"
FROM
	"conduit_db"."COMMENTS"
INNER JOIN
	"conduit_db"."USERS"
	ON
		"USERS"."id" = "COMMENTS"."user_id"
WHERE
	"COMMENTS"."article_id" = $1 AND "COMMENTS"."team_id" = $2;