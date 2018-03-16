--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 10.1

-- Started on 2018-01-26 13:33:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = conduit_db, pg_catalog;

--
-- TOC entry 2155 (class 0 OID 16412)
-- Dependencies: 185
-- Data for Name: ATTRIBUTES; Type: TABLE DATA; Schema: conduit_db; Owner: postgres
--

INSERT INTO "ATTRIBUTES" VALUES (5, 'Removed', 'Article has been removed from the stream', 'trash', 'removed', false, true, false, false);
INSERT INTO "ATTRIBUTES" VALUES (6, 'image', 'Article has an associated image', 'picture', 'image', true, true, true, false);
INSERT INTO "ATTRIBUTES" VALUES (7, 'In book', 'Article is in a book', 'book', 'books', true, true, false, false);
INSERT INTO "ATTRIBUTES" VALUES (8, 'Has comments', 'Article has comments', 'comment', 'comments', true, true, true, false);


--
-- TOC entry 2161 (class 0 OID 0)
-- Dependencies: 186
-- Name: ATTRIBUTES_id_seq; Type: SEQUENCE SET; Schema: conduit_db; Owner: postgres
--

SELECT pg_catalog.setval('"ATTRIBUTES_id_seq"', 8, true);


-- Completed on 2018-01-26 13:33:59

--
-- PostgreSQL database dump complete
--

