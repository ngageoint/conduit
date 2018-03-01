
INSERT INTO "ATTRIBUTES" VALUES (5, 'Removed', 'Article has been removed from the stream', 'trash', 'removed', false, true, false, false);
INSERT INTO "ATTRIBUTES" VALUES (6, 'image', 'Article has an associated image', 'picture', 'image', true, true, true, false);
INSERT INTO "ATTRIBUTES" VALUES (7, 'In book', 'Article is in a book', 'book', 'books', true, true, false, false);
INSERT INTO "ATTRIBUTES" VALUES (8, 'Has comments', 'Article has comments', 'comment', 'comments', true, true, true, false);

SELECT pg_catalog.setval('"ATTRIBUTES_id_seq"', 8, true);

