--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.7
-- Dumped by pg_dump version 9.5.7

-- Started on 2018-01-23 17:39:29

SET statement_timeout = 0;
SET lock_timeout = 0;
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

SET search_path = conduit_db, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 189 (class 1259 OID 16436)
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
-- TOC entry 197 (class 1259 OID 24603)
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
-- TOC entry 188 (class 1259 OID 16419)
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
-- TOC entry 200 (class 1259 OID 24678)
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
-- TOC entry 199 (class 1259 OID 24676)
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
-- TOC entry 2241 (class 0 OID 0)
-- Dependencies: 199
-- Name: ATTRIBUTES_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE "ATTRIBUTES_id_seq" OWNED BY "ATTRIBUTES".id;


--
-- TOC entry 196 (class 1259 OID 16505)
-- Name: BOOKS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "BOOKS" (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    team_id integer
);


ALTER TABLE "BOOKS" OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 16503)
-- Name: BOOKS_BOOK_ID_seq; Type: SEQUENCE; Schema: conduit_db; Owner: postgres
--

CREATE SEQUENCE "BOOKS_BOOK_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "BOOKS_BOOK_ID_seq" OWNER TO postgres;

--
-- TOC entry 2242 (class 0 OID 0)
-- Dependencies: 195
-- Name: BOOKS_BOOK_ID_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE "BOOKS_BOOK_ID_seq" OWNED BY "BOOKS".id;


--
-- TOC entry 183 (class 1259 OID 16397)
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
-- TOC entry 2243 (class 0 OID 0)
-- Dependencies: 183
-- Name: COLUMN "BOOKS_STATUS"."USER_ID"; Type: COMMENT; Schema: conduit_db; Owner: postgres
--

COMMENT ON COLUMN "BOOKS_STATUS"."USER_ID" IS '
';


--
-- TOC entry 190 (class 1259 OID 16445)
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
-- TOC entry 194 (class 1259 OID 16485)
-- Name: IMAGES; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "IMAGES" (
    id integer NOT NULL,
    uri character varying(256) NOT NULL,
    article_id character varying(256)
);


ALTER TABLE "IMAGES" OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 24645)
-- Name: IMAGES_STATUS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "IMAGES_STATUS" (
    team_id integer NOT NULL,
    article_id character varying(256) NOT NULL,
    image_id integer NOT NULL
);


ALTER TABLE "IMAGES_STATUS" OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 16453)
-- Name: TAGS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "TAGS" (
    article_id character varying(64) NOT NULL,
    id integer NOT NULL,
    tag character varying(64)
);


ALTER TABLE "TAGS" OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 16413)
-- Name: TEAMS; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE "TEAMS" (
    id integer NOT NULL,
    name character varying(64)
);


ALTER TABLE "TEAMS" OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 16405)
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
-- TOC entry 182 (class 1259 OID 16395)
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
-- TOC entry 2244 (class 0 OID 0)
-- Dependencies: 182
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE books_id_seq OWNED BY "BOOKS_STATUS"."BOOK_ID";


--
-- TOC entry 193 (class 1259 OID 16483)
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
-- TOC entry 2245 (class 0 OID 0)
-- Dependencies: 193
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE images_id_seq OWNED BY "IMAGES".id;


--
-- TOC entry 202 (class 1259 OID 49496)
-- Name: session; Type: TABLE; Schema: conduit_db; Owner: postgres
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 16451)
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
-- TOC entry 2246 (class 0 OID 0)
-- Dependencies: 191
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE tags_id_seq OWNED BY "TAGS".id;


--
-- TOC entry 186 (class 1259 OID 16411)
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
-- TOC entry 2247 (class 0 OID 0)
-- Dependencies: 186
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE teams_id_seq OWNED BY "TEAMS".id;


--
-- TOC entry 184 (class 1259 OID 16403)
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
-- TOC entry 2248 (class 0 OID 0)
-- Dependencies: 184
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: conduit_db; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY "USERS".id;


--
-- TOC entry 2059 (class 2604 OID 24681)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ATTRIBUTES" ALTER COLUMN id SET DEFAULT nextval('"ATTRIBUTES_id_seq"'::regclass);


--
-- TOC entry 2057 (class 2604 OID 16508)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS" ALTER COLUMN id SET DEFAULT nextval('"BOOKS_BOOK_ID_seq"'::regclass);


--
-- TOC entry 2051 (class 2604 OID 16400)
-- Name: BOOK_ID; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS" ALTER COLUMN "BOOK_ID" SET DEFAULT nextval('books_id_seq'::regclass);


--
-- TOC entry 2056 (class 2604 OID 16488)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES" ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- TOC entry 2055 (class 2604 OID 16456)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS" ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- TOC entry 2053 (class 2604 OID 16416)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS" ALTER COLUMN id SET DEFAULT nextval('teams_id_seq'::regclass);


--
-- TOC entry 2052 (class 2604 OID 16408)
-- Name: id; Type: DEFAULT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS" ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2092 (class 2606 OID 16510)
-- Name: BOOK_ID; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS"
    ADD CONSTRAINT "BOOK_ID" PRIMARY KEY (id);


--
-- TOC entry 2096 (class 2606 OID 24624)
-- Name: PK__ARICLES_EDITS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "PK__ARICLES_EDITS" PRIMARY KEY (article_id, user_id, "timestamp");


--
-- TOC entry 2102 (class 2606 OID 24687)
-- Name: PK__ATTRIBUTES; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ATTRIBUTES"
    ADD CONSTRAINT "PK__ATTRIBUTES" PRIMARY KEY (id);


--
-- TOC entry 2069 (class 2606 OID 49431)
-- Name: PK__BOOKS_STATUS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "PK__BOOKS_STATUS" PRIMARY KEY ("BOOK_ID", "ARTICLE_ID", "TEAM_ID");


--
-- TOC entry 2100 (class 2606 OID 24649)
-- Name: PK__IMAGES_STATUS; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "PK__IMAGES_STATUS" PRIMARY KEY (team_id, article_id, image_id);


--
-- TOC entry 2080 (class 2606 OID 16444)
-- Name: article_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES"
    ADD CONSTRAINT article_id PRIMARY KEY (id);


--
-- TOC entry 2083 (class 2606 OID 49433)
-- Name: comment_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT comment_id PRIMARY KEY (article_id, user_id, date);


--
-- TOC entry 2090 (class 2606 OID 16490)
-- Name: image_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT image_id PRIMARY KEY (id);


--
-- TOC entry 2104 (class 2606 OID 49503)
-- Name: session_pkey; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2078 (class 2606 OID 16423)
-- Name: status_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT status_id PRIMARY KEY (article_id, user_id, team_id);


--
-- TOC entry 2087 (class 2606 OID 16476)
-- Name: tags_pkey; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2074 (class 2606 OID 16418)
-- Name: team_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TEAMS"
    ADD CONSTRAINT team_id PRIMARY KEY (id);


--
-- TOC entry 2072 (class 2606 OID 16410)
-- Name: user_id; Type: CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS"
    ADD CONSTRAINT user_id PRIMARY KEY (id);


--
-- TOC entry 2064 (class 1259 OID 16502)
-- Name: FKI__ARTICLES__BOOKS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__BOOKS" ON "BOOKS_STATUS" USING btree ("ARTICLE_ID");


--
-- TOC entry 2065 (class 1259 OID 24602)
-- Name: FKI__ARTICLES__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("ARTICLE_ID");


--
-- TOC entry 2088 (class 1259 OID 24675)
-- Name: FKI__ARTICLES__IMAGES; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__IMAGES" ON "IMAGES" USING btree (article_id);


--
-- TOC entry 2097 (class 1259 OID 24655)
-- Name: FKI__ARTICLES__IMAGES_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__IMAGES_STATUS" ON "IMAGES_STATUS" USING btree (article_id);


--
-- TOC entry 2085 (class 1259 OID 16482)
-- Name: FKI__ARTICLES__TAGS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__ARTICLES__TAGS" ON "TAGS" USING btree (article_id);


--
-- TOC entry 2098 (class 1259 OID 24661)
-- Name: FKI__IMAGES__IMAGES_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__IMAGES__IMAGES_STATUS" ON "IMAGES_STATUS" USING btree (image_id);


--
-- TOC entry 2093 (class 1259 OID 24641)
-- Name: FKI__TEAMS__ARTICLES_EDITS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__ARTICLES_EDITS" ON "ARTICLES_EDITS" USING btree (team_id);


--
-- TOC entry 2066 (class 1259 OID 49423)
-- Name: FKI__TEAMS__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("TEAM_ID");


--
-- TOC entry 2081 (class 1259 OID 24594)
-- Name: FKI__TEAMS__COMMENTS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__COMMENTS" ON "COMMENTS" USING btree (team_id);


--
-- TOC entry 2070 (class 1259 OID 24581)
-- Name: FKI__TEAMS__USERS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__TEAMS__USERS" ON "USERS" USING btree (team_id);


--
-- TOC entry 2094 (class 1259 OID 24635)
-- Name: FKI__USERS__ARTICLES_EDITS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__USERS__ARTICLES_EDITS" ON "ARTICLES_EDITS" USING btree (user_id);


--
-- TOC entry 2067 (class 1259 OID 49429)
-- Name: FKI__USERS__BOOKS_STATUS; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX "FKI__USERS__BOOKS_STATUS" ON "BOOKS_STATUS" USING btree ("USER_ID");


--
-- TOC entry 2084 (class 1259 OID 16474)
-- Name: fki_comment_user_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_comment_user_id ON "COMMENTS" USING btree (user_id);


--
-- TOC entry 2075 (class 1259 OID 16435)
-- Name: fki_team_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_team_id ON "ARTICLES_STATUS" USING btree (team_id);


--
-- TOC entry 2076 (class 1259 OID 16429)
-- Name: fki_user_id; Type: INDEX; Schema: conduit_db; Owner: postgres
--

CREATE INDEX fki_user_id ON "ARTICLES_STATUS" USING btree (user_id);


--
-- TOC entry 2117 (class 2606 OID 24625)
-- Name: FK__ARTICLES__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__ARTICLES__ARTICLES_EDITS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2106 (class 2606 OID 24597)
-- Name: FK__ARTICLES__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__ARTICLES__BOOKS_STATUS" FOREIGN KEY ("ARTICLE_ID") REFERENCES "ARTICLES"(id);


--
-- TOC entry 2112 (class 2606 OID 16459)
-- Name: FK__ARTICLES__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__ARTICLES__COMMENTS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2116 (class 2606 OID 24670)
-- Name: FK__ARTICLES__IMAGES; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES"
    ADD CONSTRAINT "FK__ARTICLES__IMAGES" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2120 (class 2606 OID 24650)
-- Name: FK__ARTICLES__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__ARTICLES__IMAGES_STATUS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2115 (class 2606 OID 16477)
-- Name: FK__ARTICLES__TAGS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "TAGS"
    ADD CONSTRAINT "FK__ARTICLES__TAGS" FOREIGN KEY (article_id) REFERENCES "ARTICLES"(id);


--
-- TOC entry 2105 (class 2606 OID 16516)
-- Name: FK__BOOKS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__BOOKS__BOOKS_STATUS" FOREIGN KEY ("BOOK_ID") REFERENCES "BOOKS"(id);


--
-- TOC entry 2121 (class 2606 OID 24656)
-- Name: FK__IMAGES__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__IMAGES__IMAGES_STATUS" FOREIGN KEY (image_id) REFERENCES "IMAGES"(id);


--
-- TOC entry 2119 (class 2606 OID 24636)
-- Name: FK__TEAMS__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__TEAMS__ARTICLES_EDITS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2110 (class 2606 OID 16430)
-- Name: FK__TEAMS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__TEAMS__ARTICLES_STATUS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2107 (class 2606 OID 49418)
-- Name: FK__TEAMS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__TEAMS__BOOKS_STATUS" FOREIGN KEY ("TEAM_ID") REFERENCES "TEAMS"(id);


--
-- TOC entry 2114 (class 2606 OID 24589)
-- Name: FK__TEAMS__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__TEAMS__COMMENTS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2122 (class 2606 OID 24662)
-- Name: FK__TEAMS__IMAGES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "IMAGES_STATUS"
    ADD CONSTRAINT "FK__TEAMS__IMAGES_STATUS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2109 (class 2606 OID 24576)
-- Name: FK__TEAMS__USERS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "USERS"
    ADD CONSTRAINT "FK__TEAMS__USERS" FOREIGN KEY (team_id) REFERENCES "TEAMS"(id);


--
-- TOC entry 2118 (class 2606 OID 24630)
-- Name: FK__USERS__ARTICLES_EDITS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_EDITS"
    ADD CONSTRAINT "FK__USERS__ARTICLES_EDITS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2111 (class 2606 OID 16424)
-- Name: FK__USERS__ARTICLES_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "ARTICLES_STATUS"
    ADD CONSTRAINT "FK__USERS__ARTICLES_STATUS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


--
-- TOC entry 2108 (class 2606 OID 49424)
-- Name: FK__USERS__BOOKS_STATUS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "BOOKS_STATUS"
    ADD CONSTRAINT "FK__USERS__BOOKS_STATUS" FOREIGN KEY ("USER_ID") REFERENCES "USERS"(id);


--
-- TOC entry 2113 (class 2606 OID 16469)
-- Name: FK__USERS__COMMENTS; Type: FK CONSTRAINT; Schema: conduit_db; Owner: postgres
--

ALTER TABLE ONLY "COMMENTS"
    ADD CONSTRAINT "FK__USERS__COMMENTS" FOREIGN KEY (user_id) REFERENCES "USERS"(id);


-- Completed on 2018-01-23 17:39:29

--
-- PostgreSQL database dump complete
--

