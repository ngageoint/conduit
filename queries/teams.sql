-- Table: "conduit-db".teams

-- DROP TABLE "conduit-db".teams;

CREATE TABLE "conduit-db".teams
(
  id serial NOT NULL,
  name character varying(64),
  CONSTRAINT team_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "conduit-db".teams
  OWNER TO postgres;
