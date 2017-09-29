SELECT
    "ARTICLES".date,
    "ARTICLES".id,
    "ARTICLES".link,
    "ARTICLES".selected_image,
    "ARTICLES".text,
    "ARTICLES".title,
    "ARTICLES".custom_properties,
    "ARTICLES".source
FROM
    "conduit_db"."ARTICLES"
WHERE "ARTICLES".id = $1;