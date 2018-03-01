CREATE TABLE conduit_db."USERS"
(
    id integer NOT NULL DEFAULT nextval('conduit_db.users_id_seq'::regclass),
    name_first character varying(64) COLLATE pg_catalog."default",
    name_last character varying(64) COLLATE pg_catalog."default",
    name_preferred character varying(64) COLLATE pg_catalog."default",
    team_id integer,
    CONSTRAINT user_id PRIMARY KEY (id),
    CONSTRAINT "FK__TEAMS__USERS" FOREIGN KEY (team_id)
        REFERENCES conduit_db."TEAMS" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."USERS"
    OWNER to postgres;

CREATE INDEX "FKI__TEAMS__USERS"
    ON conduit_db."USERS" USING btree
    (team_id)
    TABLESPACE pg_default;