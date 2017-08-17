-- Table: "conduit-db".books

-- DROP TABLE "conduit-db".books;

CREATE TABLE "conduit-db".books
(
  id serial NOT NULL,
  name character varying(32) NOT NULL,
  CONSTRAINT book_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "conduit-db".books
  OWNER TO postgres;
