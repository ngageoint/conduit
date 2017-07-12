SELECT
    "ARTICLES".date,
    "ARTICLES".id,
    "ARTICLES".link,
    "ARTICLES".selected_image,
    "ARTICLES".text,
    "ARTICLES".title,
    "ARTICLES".custom_properties
FROM
    "conduit-db"."ARTICLES"
WHERE "ARTICLES".id = $1