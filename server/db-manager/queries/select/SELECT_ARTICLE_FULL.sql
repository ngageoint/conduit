/*INCOMPLETE*/

SELECT
    "ARTICLES".date,
    "ARTICLES".id,
    "ARTICLES".link,
    "ARTICLES".text,
    "ARTICLES".title,
    "ARTICLES".custom_properties,
    "IMAGES".uri
FROM
    "conduit_db"."ARTICLES"
FULL JOIN "conduit_db"."IMAGES"
    ON
        "IMAGES"."article_id" = "ARTICLES"."id"
WHERE "ARTICLES".id = $1;