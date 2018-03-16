INSERT INTO "conduit_db"."TEAMS" (name)
VALUES ($1)
RETURNING id;