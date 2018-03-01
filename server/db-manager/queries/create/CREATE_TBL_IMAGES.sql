CREATE TABLE conduit_db."IMAGES"
(
    id integer NOT NULL DEFAULT nextval('conduit_db.images_id_seq'::regclass),
    uri character varying(256) COLLATE pg_catalog."default" NOT NULL,
    article_id character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT image_id PRIMARY KEY (id),
    CONSTRAINT "FK__ARTICLES__IMAGES" FOREIGN KEY (article_id)
        REFERENCES conduit_db."ARTICLES" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."IMAGES"
    OWNER to postgres;

CREATE INDEX "FKI__ARTICLES__IMAGES"
    ON conduit_db."IMAGES" USING btree
    (article_id COLLATE pg_catalog."default")
    TABLESPACE pg_default;