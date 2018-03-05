
INSERT INTO conduit_db."ATTRIBUTES" VALUES (5, 'Removed', 'Article has been removed from the stream', 'trash', 'removed', false, true, false, false);
INSERT INTO conduit_db."ATTRIBUTES" VALUES (6, 'Image', 'Article has an associated image', 'picture', 'images', true, true, true, false);
INSERT INTO conduit_db."ATTRIBUTES" VALUES (7, 'In book', 'Article is in a book', 'book', 'books', true, true, false, false);
INSERT INTO conduit_db."ATTRIBUTES" VALUES (8, 'Has comments', 'Article has comments', 'comment', 'comments', true, true, true, false);

SELECT pg_catalog.setval('conduit_db."ATTRIBUTES_id_seq"', 8, true);

