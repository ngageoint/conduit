-- Table: "conduit-db".users

-- DROP TABLE "conduit-db".users;

CREATE TABLE "conduit-db".users
(
  id serial NOT NULL,
  name_first character varying(64),
  name_last character varying(64),
  name_preferred character varying(64),
  CONSTRAINT user_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "conduit-db".users
  OWNER TO postgres;
