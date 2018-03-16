SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA conduit_db AUTHORIZATION db_user;

ALTER SCHEMA conduit_db OWNER TO db_user;

SET search_path = conduit_db, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;