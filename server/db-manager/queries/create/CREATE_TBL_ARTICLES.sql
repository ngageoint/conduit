CREATE TABLE conduit_db."ARTICLES"
(
    date date NOT NULL,
    id character varying(64) COLLATE pg_catalog."default" NOT NULL,
    link character varying(256) COLLATE pg_catalog."default",
    text text COLLATE pg_catalog."default",
    title character varying(256) COLLATE pg_catalog."default",
    custom_properties jsonb,
    source character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT article_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."ARTICLES"
    OWNER TO db_user;