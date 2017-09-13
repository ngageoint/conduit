--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.7
-- Dumped by pg_dump version 9.5.7

-- Started on 2017-07-14 13:42:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16394)
-- Name: conduit-db; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "conduit-db";


ALTER SCHEMA "conduit-db" OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12355)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2187 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = "conduit-db", pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 189 (class 1259 OID 16436)
-- Name: ARTICLES; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "ARTICLES" (
    date date NOT NULL,
    id character varying(64) NOT NULL,
    link character varying(256),
    selected_image integer,
    text text,
    title character varying(256),
    custom_properties jsonb
);


ALTER TABLE "ARTICLES" OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 16419)
-- Name: ARTICLES_STATUS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "ARTICLES_STATUS" (
    article_id character varying(64) NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    read boolean
);


ALTER TABLE "ARTICLES_STATUS" OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16505)
-- Name: BOOKS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "BOOKS" (
    "ID" integer NOT NULL,
    "NAME" character varying(64) NOT NULL
);


ALTER TABLE "BOOKS" OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 16503)
-- Name: BOOKS_BOOK_ID_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE "BOOKS_BOOK_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "BOOKS_BOOK_ID_seq" OWNER TO postgres;

--
-- TOC entry 2188 (class 0 OID 0)
-- Dependencies: 195
-- Name: BOOKS_BOOK_ID_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE "BOOKS_BOOK_ID_seq" OWNED BY "BOOKS"."ID";


--
-- TOC entry 183 (class 1259 OID 16397)
-- Name: BOOKS_STATUS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "BOOKS_STATUS" (
    "BOOK_ID" integer NOT NULL,
    "ARTICLE_ID" character varying(64)
);


ALTER TABLE "BOOKS_STATUS" OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 16445)
-- Name: COMMENTS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "COMMENTS" (
    article_id character varying(64) NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    text character varying(500) NOT NULL
);


ALTER TABLE "COMMENTS" OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 16485)
-- Name: IMAGES; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "IMAGES" (
    id integer NOT NULL,
    uri character varying(256) NOT NULL,
    article_id character varying(64) NOT NULL
);


ALTER TABLE "IMAGES" OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16453)
-- Name: TAGS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "TAGS" (
    article_id character varying(64) NOT NULL,
    id integer NOT NULL,
    tag character varying(64)
);


ALTER TABLE "TAGS" OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 16413)
-- Name: TEAMS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "TEAMS" (
    id integer NOT NULL,
    name character varying(64)
);


ALTER TABLE "TEAMS" OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 16405)
-- Name: USERS; Type: TABLE; Schema: conduit-db; Owner: postgres
--

CREATE TABLE "USERS" (
    id integer NOT NULL,
    name_first character varying(64),
    name_last character varying(64),
    name_preferred character varying(64)
);


ALTER TABLE "USERS" OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 16395)
-- Name: books_id_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE books_id_seq OWNER TO postgres;

--
-- TOC entry 2189 (class 0 OID 0)
-- Dependencies: 182
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE books_id_seq OWNED BY "BOOKS_STATUS"."BOOK_ID";


--
-- TOC entry 193 (class 1259 OID 16483)
-- Name: images_id_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE images_id_seq OWNER TO postgres;

--
-- TOC entry 2190 (class 0 OID 0)
-- Dependencies: 193
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE images_id_seq OWNED BY "IMAGES".id;


--
-- TOC entry 191 (class 1259 OID 16451)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tags_id_seq OWNER TO postgres;

--
-- TOC entry 2191 (class 0 OID 0)
-- Dependencies: 191
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE tags_id_seq OWNED BY "TAGS".id;


--
-- TOC entry 186 (class 1259 OID 16411)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teams_id_seq OWNER TO postgres;

--
-- TOC entry 2192 (class 0 OID 0)
-- Dependencies: 186
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE teams_id_seq OWNED BY "TEAMS".id;


--
-- TOC entry 184 (class 1259 OID 16403)
-- Name: users_id_seq; Type: SEQUENCE; Schema: conduit-db; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- TOC entry 2193 (class 0 OID 0)
-- Dependencies: 184
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit-db; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY "USERS".id;


--
-- TOC entry 2031 (class 2604 OID 16508)
-- Name: ID; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS" ALTER COLUMN "ID" SET DEFAULT nextval('"BOOKS_BOOK_ID_seq"'::regclass);


--
-- TOC entry 2026 (class 2604 OID 16400)
-- Name: BOOK_ID; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS" ALTER COLUMN "BOOK_ID" SET DEFAULT nextval('books_id_seq'::regclass);


--
-- TOC entry 2030 (class 2604 OID 16488)
-- Name: id; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES" ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- TOC entry 2029 (class 2604 OID 16456)
-- Name: id; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "TAGS" ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- TOC entry 2028 (class 2604 OID 16416)
-- Name: id; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS" ALTER COLUMN id SET DEFAULT nextval('teams_id_seq'::regclass);


--
-- TOC entry 2027 (class 2604 OID 16408)
-- Name: id; Type: DEFAULT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "USERS" ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2056 (class 2606 OID 16510)
-- Name: ARTICLE_ID; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS"
    ADD CONSTRAINT "ARTICLE_ID" PRIMARY KEY ("ID");


--
-- TOC entry 2045 (class 2606 OID 16444)
-- Name: article_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES"
    ADD CONSTRAINT article_id PRIMARY KEY (id);


--
-- TOC entry 2034 (class 2606 OID 16402)
-- Name: book_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT book_id PRIMARY KEY ("BOOK_ID");


--
-- TOC entry 2047 (class 2606 OID 16458)
-- Name: comment_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT comment_id PRIMARY KEY (article_id, user_id, date);


--
-- TOC entry 2054 (class 2606 OID 16490)
-- Name: image_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT image_id PRIMARY KEY (id);


--
-- TOC entry 2042 (class 2606 OID 16423)
-- Name: status_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT status_id PRIMARY KEY (article_id, user_id, team_id);


--
-- TOC entry 2051 (class 2606 OID 16476)
-- Name: tags_pkey; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2038 (class 2606 OID 16418)
-- Name: team_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS"
    ADD CONSTRAINT team_id PRIMARY KEY (id);


--
-- TOC entry 2036 (class 2606 OID 16410)
-- Name: user_id; Type: CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "USERS"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 2032 (class 1259 OID 16502)
-- Name: FKI__ARTICLES__BOOKS; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__BOOKS" ON "BOOKS_STATUS" USING btree ("ARTICLE_ID");


--
-- TOC entry 2052 (class 1259 OID 16496)
-- Name: FKI__ARTICLES__IMAGES; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__IMAGES" ON "IMAGES" USING btree (article_id);


--
-- TOC entry 2049 (class 1259 OID 16482)
-- Name: FKI__ARTICLES__TAGS; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__TAGS" ON "TAGS" USING btree (article_id);


--
-- TOC entry 2043 (class 1259 OID 16540)
-- Name: FKI__IMAGES__ARTICLES; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX "FKI__IMAGES__ARTICLES" ON "ARTICLES" USING btree (selected_image);


--
-- TOC entry 2048 (class 1259 OID 16474)
-- Name: fki_comment_user_id; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX fki_comment_user_id ON "COMMENTS" USING btree (user_id);


--
-- TOC entry 2039 (class 1259 OID 16435)
-- Name: fki_team_id; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX fki_team_id ON "ARTICLES_STATUS" USING btree (team_id);


--
-- TOC entry 2040 (class 1259 OID 16429)
-- Name: fki_user_id; Type: INDEX; Schema: conduit-db; Owner: postgres
--

CREATE INDEX fki_user_id ON "ARTICLES_STATUS" USING btree (user_id);


--
-- TOC entry 2057 (class 2606 OID 16497)
-- Name: FK__ARTICLES__BOOKS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__ARTICLES__BOOKS" FOREIGN KEY ("ARTICLE_ID") REFERENCES "ARTICLES"(id);


--
-- TOC entry 2062 (class 2606 OID 16459)
-- Name: FK__ARTICLES__COMMENTS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__ARTICLES__COMMENTS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2065 (class 2606 OID 16491)
-- Name: FK__ARTICLES__IMAGES; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT "FK__ARTICLES__IMAGES" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2064 (class 2606 OID 16477)
-- Name: FK__ARTICLES__TAGS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT "FK__ARTICLES__TAGS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2058 (class 2606 OID 16516)
-- Name: FK__BOOKS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__BOOKS__BOOKS_STATUS" FOREIGN KEY ("BOOK_ID") REFERENCES "BOOKS"("ID");


--
-- TOC entry 2061 (class 2606 OID 16535)
-- Name: FK__IMAGES__ARTICLES; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES"
    ADD CONSTRAINT "FK__IMAGES__ARTICLES" FOREIGN KEY (selected_image) REFERENCES "IMAGES"(id);


--
-- TOC entry 2059 (class 2606 OID 16430)
-- Name: FK__TEAMS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__TEAMS__ARTICLES_STATUS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2060 (class 2606 OID 16424)
-- Name: FK__USERS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__USERS__ARTICLES_STATUS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2063 (class 2606 OID 16469)
-- Name: FK__USERS__COMMENTS; Type: FK CONSTRAINT; Schema: conduit-db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__USERS__COMMENTS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2186 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-07-14 13:42:13

--
-- PostgreSQL database dump complete
--

