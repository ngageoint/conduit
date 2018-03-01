CREATE TABLE conduit_db."ARTICLES_STATUS"
(
    article_id character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    team_id integer NOT NULL,
    read boolean,
    "timestamp" timestamp with time zone NOT NULL DEFAULT now(),
    removed boolean,
    CONSTRAINT status_id PRIMARY KEY (article_id, user_id, team_id),
    CONSTRAINT "FK__TEAMS__ARTICLES_STATUS" FOREIGN KEY (team_id)
        REFERENCES conduit_db."TEAMS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "FK__USERS__ARTICLES_STATUS" FOREIGN KEY (user_id)
        REFERENCES conduit_db."USERS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."ARTICLES_STATUS"
    OWNER to postgres;

CREATE INDEX fki_team_id
    ON conduit_db."ARTICLES_STATUS" USING btree
    (team_id)
    TABLESPACE pg_default;

CREATE INDEX fki_user_id
    ON conduit_db."ARTICLES_STATUS" USING btree
    (user_id)
    TABLESPACE pg_default;