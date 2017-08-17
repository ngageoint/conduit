-- Table: "conduit-db".articles_status

-- DROP TABLE "conduit-db".articles_status;

CREATE TABLE "conduit-db".articles_status
(
  article_id character varying(64) NOT NULL,
  user_id integer NOT NULL,
  team_id integer NOT NULL,
  read boolean,
  CONSTRAINT status_id PRIMARY KEY (article_id, user_id, team_id),
  CONSTRAINT team_id FOREIGN KEY (team_id)
      REFERENCES "conduit-db".teams (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT user_id FOREIGN KEY (user_id)
      REFERENCES "conduit-db".users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "conduit-db".articles_status
  OWNER TO postgres;

-- Index: "conduit-db".fki_team_id

-- DROP INDEX "conduit-db".fki_team_id;

CREATE INDEX fki_team_id
  ON "conduit-db".articles_status
  USING btree
  (team_id);

-- Index: "conduit-db".fki_user_id

-- DROP INDEX "conduit-db".fki_user_id;

CREATE INDEX fki_user_id
  ON "conduit-db".articles_status
  USING btree
  (user_id);

