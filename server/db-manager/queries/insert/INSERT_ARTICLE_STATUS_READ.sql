INSERT INTO "conduit_db"."ARTICLES_STATUS" (article_id, user_id, team_id, read)
VALUES ($1,$2,$3,$4)
ON CONFLICT (article_id, user_id, team_id) DO UPDATE
SET read = $4;