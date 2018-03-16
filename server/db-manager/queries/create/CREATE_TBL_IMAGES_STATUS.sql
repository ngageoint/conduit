CREATE TABLE conduit_db."IMAGES_STATUS"
(
    team_id integer NOT NULL,
    article_id character varying(256) COLLATE pg_catalog."default" NOT NULL,
    image_id integer NOT NULL,
    CONSTRAINT "PK__IMAGES_STATUS" PRIMARY KEY (team_id, article_id, image_id),
    CONSTRAINT "FK__ARTICLES__IMAGES_STATUS" FOREIGN KEY (article_id)
        REFERENCES conduit_db."ARTICLES" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__IMAGES__IMAGES_STATUS" FOREIGN KEY (image_id)
        REFERENCES conduit_db."IMAGES" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__TEAMS__IMAGES_STATUS" FOREIGN KEY (team_id)
        REFERENCES conduit_db."TEAMS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."IMAGES_STATUS"
    OWNER TO db_user;

CREATE INDEX "FKI__ARTICLES__IMAGES_STATUS"
    ON conduit_db."IMAGES_STATUS" USING btree
    (article_id COLLATE pg_catalog."default")
    TABLESPACE pg_default;

CREATE INDEX "FKI__IMAGES__IMAGES_STATUS"
    ON conduit_db."IMAGES_STATUS" USING btree
    (image_id)
    TABLESPACE pg_default;