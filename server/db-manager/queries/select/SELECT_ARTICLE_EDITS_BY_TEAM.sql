SELECT
    "ARTICLES_EDITS".article_id,
    "ARTICLES_EDITS".user_id,
    "ARTICLES_EDITS".timestamp
FROM
    "conduit_db"."ARTICLES_EDITS"
WHERE "ARTICLES_EDITS".article_id = $1 AND "ARTICLES_EDITS".team_id = $2
ORDER BY timestamp ASC;