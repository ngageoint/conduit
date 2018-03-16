INSERT INTO "conduit_db"."IMAGES_STATUS"
VALUES ($1,$2,$3)
ON CONFLICT (team_id, article_id) DO UPDATE
SET image_id = $3;