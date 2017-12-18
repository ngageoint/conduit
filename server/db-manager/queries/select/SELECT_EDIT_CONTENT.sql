SELECT
    "ARTICLES_EDITS".user_id,
    "ARTICLES_EDITS".title,
    "ARTICLES_EDITS".text
FROM
    "conduit_db"."ARTICLES_EDITS"
WHERE   "ARTICLES_EDITS".article_id = $1 
        AND "ARTICLES_EDITS".team_id = $2 
        AND "ARTICLES_EDITS".timestamp = $3;