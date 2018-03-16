INSERT INTO "conduit_db"."BOOKS" (name, team_id)
VALUES ($1,$2)
RETURNING id;