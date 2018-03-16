CREATE TABLE conduit_db."TEAMS"
(
    id integer NOT NULL DEFAULT nextval('conduit_db.teams_id_seq'::regclass),
    name character varying(64) COLLATE pg_catalog."default",
    CONSTRAINT team_id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE conduit_db."TEAMS"
    OWNER TO db_user;