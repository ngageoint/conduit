SELECT
    "ARTICLES".date,
    "ARTICLES".id,
    "ARTICLES".link,
    "ARTICLES".text,
    "ARTICLES".title,
    "ARTICLES".custom_properties
FROM
    "conduit_db"."ARTICLES"
WHERE "ARTICLES".date >= $1