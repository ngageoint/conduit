CREATE TABLE conduit_db."ATTRIBUTES"
(
    id integer NOT NULL DEFAULT nextval('conduit_db."ATTRIBUTES_id_seq"'::regclass),
    name character varying(16) COLLATE pg_catalog."default" NOT NULL,
    alt character varying(64) COLLATE pg_catalog."default" NOT NULL,
    glyphicon character varying(16) COLLATE pg_catalog."default" NOT NULL,
    compare character varying(16) COLLATE pg_catalog."default" NOT NULL,
    filter boolean NOT NULL DEFAULT false,
    action boolean NOT NULL DEFAULT false,
    "bookAction" boolean NOT NULL DEFAULT false,
    checked boolean NOT NULL DEFAULT false,
    CONSTRAINT "PK__ATTRIBUTES" PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."ATTRIBUTES"
    OWNER to postgres;