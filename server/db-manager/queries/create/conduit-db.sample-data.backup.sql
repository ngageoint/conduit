--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.7
-- Dumped by pg_dump version 9.5.7

-- Started on 2017-09-28 07:49:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = conduit_db, pg_catalog;

--
-- TOC entry 2189 (class 0 OID 16436)
-- Dependencies: 189
-- Data for Name: ARTICLES; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "ARTICLES" VALUES ('2017-07-10', '1', 'example.com', 3, 'Lorem Ipsum', 'Article One', NULL);
INSERT INTO "ARTICLES" VALUES ('2017-07-12', '2', 'sample.org', 4, 'Lorem Ipsum', 'Article Two', NULL);
INSERT INTO "ARTICLES" VALUES ('2017-07-14', '3', 'www.google.com', 3, NULL, 'Article Three', '{}');


--
-- TOC entry 2187 (class 0 OID 16413)
-- Dependencies: 187
-- Data for Name: TEAMS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "TEAMS" VALUES (1, 'DAT');


--
-- TOC entry 2185 (class 0 OID 16405)
-- Dependencies: 185
-- Data for Name: USERS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "USERS" VALUES (1, 'Jeffrey', 'Scott', 'Scott', 1);
INSERT INTO "USERS" VALUES (2, 'Brian', 'Wood', 'Brian', 1);


--
-- TOC entry 2188 (class 0 OID 16419)
-- Dependencies: 188
-- Data for Name: ARTICLES_STATUS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "ARTICLES_STATUS" VALUES ('1', 1, 1, true);
INSERT INTO "ARTICLES_STATUS" VALUES ('1', 2, 1, false);


--
-- TOC entry 2196 (class 0 OID 16505)
-- Dependencies: 196
-- Data for Name: BOOKS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "BOOKS" VALUES (1, 'World News');
INSERT INTO "BOOKS" VALUES (2, 'Local News');
INSERT INTO "BOOKS" VALUES (3, 'Doggo News');


--
-- TOC entry 2201 (class 0 OID 0)
-- Dependencies: 195
-- Name: BOOKS_BOOK_ID_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('"BOOKS_BOOK_ID_seq"', 3, true);


--
-- TOC entry 2183 (class 0 OID 16397)
-- Dependencies: 183
-- Data for Name: BOOKS_STATUS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "BOOKS_STATUS" VALUES (2, '1');
INSERT INTO "BOOKS_STATUS" VALUES (3, '1');


--
-- TOC entry 2190 (class 0 OID 16445)
-- Dependencies: 190
-- Data for Name: COMMENTS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "COMMENTS" VALUES ('1', 1, '2017-07-12', 'This is a sample comment from Scott');
INSERT INTO "COMMENTS" VALUES ('1', 2, '2017-07-12', 'This is anoter comment from  Brian');


--
-- TOC entry 2194 (class 0 OID 16485)
-- Dependencies: 194
-- Data for Name: IMAGES; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "IMAGES" VALUES (1, 'example.com/image', '1');
INSERT INTO "IMAGES" VALUES (3, 'example.com/image2', '1');
INSERT INTO "IMAGES" VALUES (4, 'sample.org/image', '2');


--
-- TOC entry 2192 (class 0 OID 16453)
-- Dependencies: 192
-- Data for Name: TAGS; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "TAGS" VALUES ('1', 1, 'Sample');
INSERT INTO "TAGS" VALUES ('1', 2, 'Example.com');
INSERT INTO "TAGS" VALUES ('2', 3, 'Sample');
INSERT INTO "TAGS" VALUES ('2', 4, 'Sample.org');


--
-- TOC entry 2202 (class 0 OID 0)
-- Dependencies: 182
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('books_id_seq', 2, true);


--
-- TOC entry 2203 (class 0 OID 0)
-- Dependencies: 193
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('images_id_seq', 4, true);


--
-- TOC entry 2204 (class 0 OID 0)
-- Dependencies: 191
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('tags_id_seq', 4, true);


--
-- TOC entry 2205 (class 0 OID 0)
-- Dependencies: 186
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('teams_id_seq', 1, true);


--
-- TOC entry 2206 (class 0 OID 0)
-- Dependencies: 184
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 2, true);


-- Completed on 2017-09-28 07:49:35

--
-- PostgreSQL database dump complete
--

