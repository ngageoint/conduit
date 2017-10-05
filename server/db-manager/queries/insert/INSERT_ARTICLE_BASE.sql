INSERT INTO "conduit_db"."ARTICLES"
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
ON CONFLICT (id) DO UPDATE
SET text = $5, title = $6