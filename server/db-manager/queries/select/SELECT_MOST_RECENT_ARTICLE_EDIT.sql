SELECT
    "ARTICLES_EDITS".article_id,
    "ARTICLES_EDITS".title,
    "ARTICLES_EDITS".text
FROM
    "conduit_db"."ARTICLES_EDITS"
WHERE "ARTICLES_EDITS".article_id = $1 AND "ARTICLES_EDITS".team_id = $2
ORDER BY timestamp DESC
LIMIT 1;