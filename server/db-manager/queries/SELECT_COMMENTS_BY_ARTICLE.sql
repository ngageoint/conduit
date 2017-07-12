SELECT
	"COMMENTS"."user_id",
	"USERS"."name_preferred",
	"COMMENTS"."date",
	"COMMENTS"."text"
FROM
	"conduit-db"."COMMENTS"
INNER JOIN
	"conduit-db"."USERS"
	ON
		"USERS"."id" = "COMMENTS"."user_id"
WHERE
	"COMMENTS"."article_id" = $1;