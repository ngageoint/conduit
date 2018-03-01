CREATE TABLE conduit_db."TAGS"
(
    article_id character varying(64) NOT NULL,
    id integer NOT NULL,
    tag character varying(64)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."TAGS"
    OWNER to postgres;

CREATE INDEX "FKI__ARTICLES__TAGS"
    ON conduit_db."TAGS" USING btree
    (article_id)
    TABLESPACE pg_default;