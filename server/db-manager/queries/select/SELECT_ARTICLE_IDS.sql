﻿SELECT
    "ARTICLES".id
FROM
    "conduit_db"."ARTICLES"
WHERE "ARTICLES".date >= $1
ORDER BY "ARTICLES".date DESC, "ARTICLES".id ASC