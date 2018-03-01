--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 10.1

-- Started on 2018-02-28 12:49:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16394)
-- Name: conduit_db; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA conduit_db;


ALTER SCHEMA conduit_db OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12355)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2238 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = conduit_db, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 182 (class 1259 OID 16395)
-- Name: ARTICLES; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "ARTICLES" (
    date date NOT NULL,
    id character varying(64) NOT NULL,
    link character varying(256),
    text text,
    title character varying(256),
    custom_properties jsonb,
    source character varying(256)
);


ALTER TABLE "ARTICLES" OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 16401)
-- Name: ARTICLES_EDITS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "ARTICLES_EDITS" (
    article_id character varying(64) NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    title character varying(256),
    text text,
    "timestamp" timestamp with time zone DEFAULT (now())::timestamp(0) without time zone NOT NULL
);


ALTER TABLE "ARTICLES_EDITS" OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 16408)
-- Name: ARTICLES_STATUS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "ARTICLES_STATUS" (
    article_id character varying(64) NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    read boolean,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    removed boolean
);


ALTER TABLE "ARTICLES_STATUS" OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 16412)
-- Name: ATTRIBUTES; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "ATTRIBUTES" (
    id integer NOT NULL,
    name character varying(16) NOT NULL,
    alt character varying(64) NOT NULL,
    glyphicon character varying(16) NOT NULL,
    compare character varying(16) NOT NULL,
    filter boolean DEFAULT false NOT NULL,
    action boolean DEFAULT false NOT NULL,
    "bookAction" boolean DEFAULT false NOT NULL,
    checked boolean DEFAULT false NOT NULL
);


ALTER TABLE "ATTRIBUTES" OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 16419)
-- Name: ATTRIBUTES_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE "ATTRIBUTES_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "ATTRIBUTES_id_seq" OWNER TO postgres;

--
-- TOC entry 2239 (class 0 OID 0)
-- Dependencies: 186
-- Name: ATTRIBUTES_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE "ATTRIBUTES_id_seq" OWNED BY "ATTRIBUTES".id;


--
-- TOC entry 188 (class 1259 OID 16426)
-- Name: BOOKS_STATUS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "BOOKS_STATUS" (
    "BOOK_ID" integer NOT NULL,
    "ARTICLE_ID" character varying(64) NOT NULL,
    "TEAM_ID" integer NOT NULL,
    "USER_ID" integer
);


ALTER TABLE "BOOKS_STATUS" OWNER TO postgres;

--
-- TOC entry 2240 (class 0 OID 0)
-- Dependencies: 188
-- Name: COLUMN "BOOKS_STATUS"."USER_ID"; Type: COMMENT; Schema: conduit_db; Owner: postgres
--

COMMENT ON COLUMN "BOOKS_STATUS"."USER_ID" IS '
';


--
-- TOC entry 195 (class 1259 OID 16453)
-- Name: books_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE books_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE books_id_seq OWNER TO postgres;

--
-- TOC entry 2241 (class 0 OID 0)
-- Dependencies: 195
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE books_id_seq OWNED BY "BOOKS_STATUS"."BOOK_ID";


--
-- TOC entry 187 (class 1259 OID 16421)
-- Name: BOOKS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "BOOKS" (
    id integer DEFAULT nextval('books_id_seq'::regclass) NOT NULL,
    name character varying(64) NOT NULL,
    team_id integer
);


ALTER TABLE "BOOKS" OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 16429)
-- Name: COMMENTS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "COMMENTS" (
    article_id character varying(64) NOT NULL,
    user_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    text character varying(500) NOT NULL,
    team_id integer
);


ALTER TABLE "COMMENTS" OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 16435)
-- Name: IMAGES; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "IMAGES" (
    id integer NOT NULL,
    uri character varying(256) NOT NULL,
    article_id character varying(256)
);


ALTER TABLE "IMAGES" OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 16441)
-- Name: IMAGES_STATUS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "IMAGES_STATUS" (
    team_id integer NOT NULL,
    article_id character varying(256) NOT NULL,
    image_id integer NOT NULL
);


ALTER TABLE "IMAGES_STATUS" OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16444)
-- Name: TAGS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "TAGS" (
    article_id character varying(64) NOT NULL,
    id integer NOT NULL,
    tag character varying(64)
);


ALTER TABLE "TAGS" OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 16447)
-- Name: TEAMS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "TEAMS" (
    id integer NOT NULL,
    name character varying(64)
);


ALTER TABLE "TEAMS" OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 16450)
-- Name: USERS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "USERS" (
    id integer NOT NULL,
    name_first character varying(64),
    name_last character varying(64),
    name_preferred character varying(64),
    team_id integer
);


ALTER TABLE "USERS" OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 16455)
-- Name: images_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE images_id_seq OWNER TO postgres;

--
-- TOC entry 2242 (class 0 OID 0)
-- Dependencies: 196
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE images_id_seq OWNED BY "IMAGES".id;


--
-- TOC entry 197 (class 1259 OID 16457)
-- Name: session; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16463)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tags_id_seq OWNER TO postgres;

--
-- TOC entry 2243 (class 0 OID 0)
-- Dependencies: 198
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE tags_id_seq OWNED BY "TAGS".id;


--
-- TOC entry 199 (class 1259 OID 16465)
-- Name: teams_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE teams_id_seq OWNER TO postgres;

--
-- TOC entry 2244 (class 0 OID 0)
-- Dependencies: 199
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE teams_id_seq OWNED BY "TEAMS".id;


--
-- TOC entry 200 (class 1259 OID 16467)
-- Name: users_id_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- TOC entry 2245 (class 0 OID 0)
-- Dependencies: 200
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY "USERS".id;


--
-- TOC entry 2051 (class 2604 OID 16469)
-- Name: ATTRIBUTES id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ATTRIBUTES" ALTER COLUMN id SET DEFAULT nextval('"ATTRIBUTES_id_seq"'::regclass);


--
-- TOC entry 2053 (class 2604 OID 16471)
-- Name: BOOKS_STATUS BOOK_ID; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS" ALTER COLUMN "BOOK_ID" SET DEFAULT nextval('books_id_seq'::regclass);


--
-- TOC entry 2054 (class 2604 OID 16472)
-- Name: IMAGES id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES" ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- TOC entry 2055 (class 2604 OID 16473)
-- Name: TAGS id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS" ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- TOC entry 2056 (class 2604 OID 16474)
-- Name: TEAMS id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS" ALTER COLUMN id SET DEFAULT nextval('teams_id_seq'::regclass);


--
-- TOC entry 2057 (class 2604 OID 16475)
-- Name: USERS id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS" ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2071 (class 2606 OID 16477)
-- Name: BOOKS BOOK_ID; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS"
    ADD CONSTRAINT "BOOK_ID" PRIMARY KEY (id);


--
-- TOC entry 2063 (class 2606 OID 16479)
-- Name: ARTICLES_EDITS PK__ARICLES_EDITS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "PK__ARICLES_EDITS" PRIMARY KEY (article_id, user_id, "timestamp");


--
-- TOC entry 2069 (class 2606 OID 16481)
-- Name: ATTRIBUTES PK__ATTRIBUTES; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ATTRIBUTES"
    ADD CONSTRAINT "PK__ATTRIBUTES" PRIMARY KEY (id);


--
-- TOC entry 2077 (class 2606 OID 16483)
-- Name: BOOKS_STATUS PK__BOOKS_STATUS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "PK__BOOKS_STATUS" PRIMARY KEY ("BOOK_ID", "ARTICLE_ID", "TEAM_ID");


--
-- TOC entry 2088 (class 2606 OID 16485)
-- Name: IMAGES_STATUS PK__IMAGES_STATUS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "PK__IMAGES_STATUS" PRIMARY KEY (team_id, article_id, image_id);


--
-- TOC entry 2059 (class 2606 OID 16487)
-- Name: ARTICLES article_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES"
    ADD CONSTRAINT article_id PRIMARY KEY (id);


--
-- TOC entry 2080 (class 2606 OID 16489)
-- Name: COMMENTS comment_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT comment_id PRIMARY KEY (article_id, user_id, date);


--
-- TOC entry 2084 (class 2606 OID 16491)
-- Name: IMAGES image_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT image_id PRIMARY KEY (id);


--
-- TOC entry 2098 (class 2606 OID 16493)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2067 (class 2606 OID 16495)
-- Name: ARTICLES_STATUS status_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT status_id PRIMARY KEY (article_id, user_id, team_id);


--
-- TOC entry 2091 (class 2606 OID 16497)
-- Name: TAGS tags_pkey; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2093 (class 2606 OID 16499)
-- Name: TEAMS team_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS"
    ADD CONSTRAINT team_id PRIMARY KEY (id);


--
-- TOC entry 2096 (class 2606 OID 16501)
-- Name: USERS user_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 2072 (class 1259 OID 16502)
-- Name: FKI__ARTICLES__BOOKS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__BOOKS" ON "BOOKS_STATUS" USING btree ("ARTICLE_ID");


--
-- TOC entry 2073 (class 1259 OID 16503)
-- Name: FKI__ARTICLES__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("ARTICLE_ID");


--
-- TOC entry 2082 (class 1259 OID 16504)
-- Name: FKI__ARTICLES__IMAGES; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__IMAGES" ON "IMAGES" USING btree (article_id);


--
-- TOC entry 2085 (class 1259 OID 16505)
-- Name: FKI__ARTICLES__IMAGES_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__IMAGES_STATUS" ON "IMAGES_STATUS" USING btree (article_id);


--
-- TOC entry 2089 (class 1259 OID 16506)
-- Name: FKI__ARTICLES__TAGS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__TAGS" ON "TAGS" USING btree (article_id);


--
-- TOC entry 2086 (class 1259 OID 16507)
-- Name: FKI__IMAGES__IMAGES_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__IMAGES__IMAGES_STATUS" ON "IMAGES_STATUS" USING btree (image_id);


--
-- TOC entry 2060 (class 1259 OID 16508)
-- Name: FKI__TEAMS__ARTICLES_EDITS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__ARTICLES_EDITS" ON "ARTICLES_EDITS" USING btree (team_id);


--
-- TOC entry 2074 (class 1259 OID 16509)
-- Name: FKI__TEAMS__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("TEAM_ID");


--
-- TOC entry 2078 (class 1259 OID 16510)
-- Name: FKI__TEAMS__COMMENTS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__COMMENTS" ON "COMMENTS" USING btree (team_id);


--
-- TOC entry 2094 (class 1259 OID 16511)
-- Name: FKI__TEAMS__USERS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__USERS" ON "USERS" USING btree (team_id);


--
-- TOC entry 2061 (class 1259 OID 16512)
-- Name: FKI__USERS__ARTICLES_EDITS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__USERS__ARTICLES_EDITS" ON "ARTICLES_EDITS" USING btree (user_id);


--
-- TOC entry 2075 (class 1259 OID 16513)
-- Name: FKI__USERS__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__USERS__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("USER_ID");


--
-- TOC entry 2081 (class 1259 OID 16514)
-- Name: fki_comment_user_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_comment_user_id ON "COMMENTS" USING btree (user_id);


--
-- TOC entry 2064 (class 1259 OID 16515)
-- Name: fki_team_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_team_id ON "ARTICLES_STATUS" USING btree (team_id);


--
-- TOC entry 2065 (class 1259 OID 16516)
-- Name: fki_user_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_user_id ON "ARTICLES_STATUS" USING btree (user_id);


--
-- TOC entry 2099 (class 2606 OID 16517)
-- Name: ARTICLES_EDITS FK__ARTICLES__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__ARTICLES__ARTICLES_EDITS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2104 (class 2606 OID 16522)
-- Name: BOOKS_STATUS FK__ARTICLES__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__ARTICLES__BOOKS_STATUS" FOREIGN KEY ("ARTICLE_ID") REFERENCES "ARTICLES"(id);


--
-- TOC entry 2108 (class 2606 OID 16527)
-- Name: COMMENTS FK__ARTICLES__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__ARTICLES__COMMENTS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2111 (class 2606 OID 16532)
-- Name: IMAGES FK__ARTICLES__IMAGES; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT "FK__ARTICLES__IMAGES" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2112 (class 2606 OID 16537)
-- Name: IMAGES_STATUS FK__ARTICLES__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__ARTICLES__IMAGES_STATUS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2115 (class 2606 OID 16542)
-- Name: TAGS FK__ARTICLES__TAGS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT "FK__ARTICLES__TAGS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2105 (class 2606 OID 16547)
-- Name: BOOKS_STATUS FK__BOOKS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__BOOKS__BOOKS_STATUS" FOREIGN KEY ("BOOK_ID") REFERENCES "BOOKS"(id);


--
-- TOC entry 2113 (class 2606 OID 16552)
-- Name: IMAGES_STATUS FK__IMAGES__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__IMAGES__IMAGES_STATUS" FOREIGN KEY (image_id) REFERENCES "IMAGES"(id);


--
-- TOC entry 2100 (class 2606 OID 16557)
-- Name: ARTICLES_EDITS FK__TEAMS__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__TEAMS__ARTICLES_EDITS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2102 (class 2606 OID 16562)
-- Name: ARTICLES_STATUS FK__TEAMS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__TEAMS__ARTICLES_STATUS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2106 (class 2606 OID 16567)
-- Name: BOOKS_STATUS FK__TEAMS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__TEAMS__BOOKS_STATUS" FOREIGN KEY ("TEAM_ID") REFERENCES "TEAMS"(id);


--
-- TOC entry 2109 (class 2606 OID 16572)
-- Name: COMMENTS FK__TEAMS__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__TEAMS__COMMENTS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2114 (class 2606 OID 16577)
-- Name: IMAGES_STATUS FK__TEAMS__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__TEAMS__IMAGES_STATUS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2116 (class 2606 OID 16582)
-- Name: USERS FK__TEAMS__USERS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS"
    ADD CONSTRAINT "FK__TEAMS__USERS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2101 (class 2606 OID 16587)
-- Name: ARTICLES_EDITS FK__USERS__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__USERS__ARTICLES_EDITS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2103 (class 2606 OID 16592)
-- Name: ARTICLES_STATUS FK__USERS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__USERS__ARTICLES_STATUS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2107 (class 2606 OID 16597)
-- Name: BOOKS_STATUS FK__USERS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__USERS__BOOKS_STATUS" FOREIGN KEY ("USER_ID") REFERENCES "USERS"(id);


--
-- TOC entry 2110 (class 2606 OID 16602)
-- Name: COMMENTS FK__USERS__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__USERS__COMMENTS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2237 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2018-02-28 12:49:23

--
-- PostgreSQL database dump complete
--

