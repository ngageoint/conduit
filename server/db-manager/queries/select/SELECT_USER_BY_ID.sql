SELECT users.id, users.name_first, users.name_last, users.name_preferred, users.team_id, teams.name
FROM
	"conduit_db"."USERS" users
INNER JOIN "conduit_db"."TEAMS" teams ON teams.id = users.team_id
WHERE
	users."id" = $1;