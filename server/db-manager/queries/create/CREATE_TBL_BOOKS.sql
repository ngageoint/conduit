CREATE TABLE conduit_db."BOOKS"
(
    id integer NOT NULL DEFAULT nextval('conduit_db.books_id_seq'::regclass),
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    team_id integer,
    CONSTRAINT "BOOK_ID" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."BOOKS"
    OWNER TO db_user;