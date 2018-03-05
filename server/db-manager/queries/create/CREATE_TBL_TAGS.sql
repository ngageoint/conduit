CREATE TABLE conduit_db."TAGS"
(
    article_id character varying(64) NOT NULL,
    id integer NOT NULL DEFAULT nextval('conduit_db.tags_id_seq'::regclass),
    tag character varying(64)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."TAGS"
    OWNER TO db_user;

CREATE INDEX "FKI__ARTICLES__TAGS"
    ON conduit_db."TAGS" USING btree
    (article_id)
    TABLESPACE pg_default;