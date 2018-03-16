CREATE TABLE conduit_db."COMMENTS"
(
    article_id character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    text character varying(500) COLLATE pg_catalog."default" NOT NULL,
    team_id integer,
    CONSTRAINT comment_id PRIMARY KEY (article_id, user_id, date),
    CONSTRAINT "FK__ARTICLES__COMMENTS" FOREIGN KEY (article_id)
        REFERENCES conduit_db."ARTICLES" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__TEAMS__COMMENTS" FOREIGN KEY (team_id)
        REFERENCES conduit_db."TEAMS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__USERS__COMMENTS" FOREIGN KEY (user_id)
        REFERENCES conduit_db."USERS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."COMMENTS"
    OWNER TO db_user;

CREATE INDEX "FKI__TEAMS__COMMENTS"
    ON conduit_db."COMMENTS" USING btree
    (team_id)
    TABLESPACE pg_default;

CREATE INDEX fki_comment_user_id
    ON conduit_db."COMMENTS" USING btree
    (user_id)
    TABLESPACE pg_default;