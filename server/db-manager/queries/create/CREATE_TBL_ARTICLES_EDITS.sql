
CREATE TABLE conduit_db."ARTICLES_EDITS"
(
    article_id character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    title character varying(256) COLLATE pg_catalog."default",
    text text COLLATE pg_catalog."default",
    "timestamp" timestamp with time zone NOT NULL DEFAULT (now())::timestamp(0) without time zone,
    CONSTRAINT "PK__ARICLES_EDITS" PRIMARY KEY (article_id, user_id, "timestamp"),
    CONSTRAINT "FK__ARTICLES__ARTICLES_EDITS" FOREIGN KEY (article_id)
        REFERENCES conduit_db."ARTICLES" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__TEAMS__ARTICLES_EDITS" FOREIGN KEY (team_id)
        REFERENCES conduit_db."TEAMS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__USERS__ARTICLES_EDITS" FOREIGN KEY (user_id)
        REFERENCES conduit_db."USERS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."ARTICLES_EDITS"
    OWNER to postgres;

CREATE INDEX "FKI__TEAMS__ARTICLES_EDITS"
    ON conduit_db."ARTICLES_EDITS" USING btree
    (team_id)
    TABLESPACE pg_default;

CREATE INDEX "FKI__USERS__ARTICLES_EDITS"
    ON conduit_db."ARTICLES_EDITS" USING btree
    (user_id)
    TABLESPACE pg_default;