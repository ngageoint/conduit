INSERT INTO "conduit_db"."ARTICLES"
VALUES ($1,$2,$3,$4,$5,$6,$7)
ON CONFLICT (id) DO UPDATE
SET text = $4, title = $5