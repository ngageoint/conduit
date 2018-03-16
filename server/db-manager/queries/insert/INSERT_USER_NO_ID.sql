INSERT INTO "conduit_db"."USERS" (name_first, name_last, name_preferred, team_id)
VALUES ($1,$2,$3,$4)
RETURNING id;