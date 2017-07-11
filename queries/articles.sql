-- Table: "conduit-db".articles

-- DROP TABLE "conduit-db".articles;

CREATE TABLE "conduit-db".articles
(
  books integer[],
  comments character varying(500)[],
  date date NOT NULL,
  id character varying(64) NOT NULL,
  images character varying(256)[],
  link character varying(256),
  selected_image smallint NOT NULL DEFAULT 0,
  tags character varying(64)[],
  text text,
  title character varying(256),
  custom_properties jsonb,
  CONSTRAINT article_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "conduit-db".articles
  OWNER TO postgres;
