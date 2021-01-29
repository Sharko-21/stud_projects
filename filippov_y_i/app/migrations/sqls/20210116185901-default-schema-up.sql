/* Replace with your SQL commands */

CREATE SEQUENCE image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS image (
    id BIGINT NOT NULL DEFAULT nextval('image_id_seq')
);

CREATE UNIQUE INDEX IF NOT EXISTS image_id_uidx ON image(id);

CREATE SEQUENCE musician_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS musician (
    id BIGINT NOT NULL DEFAULT nextval('musician_id_seq'),
    name VARCHAR NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE,
    sex BOOL,
    description VARCHAR,
    image BIGINT REFERENCES image(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS musician_id_uidx ON musician(id);
CREATE UNIQUE INDEX IF NOT EXISTS musician_name_uidx ON musician(name);

CREATE TABLE IF NOT EXISTS specialization (
    name VARCHAR NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS specialization_name_uidx ON specialization(name);

CREATE TABLE IF NOT EXISTS musician_specialization (
    musician_id BIGINT NOT NULL REFERENCES musician(id),
    specialization VARCHAR NOT NULL REFERENCES specialization(name)
);

CREATE UNIQUE INDEX IF NOT EXISTS musician_specialization_uidx ON musician_specialization(musician_id, specialization);

CREATE TABLE IF NOT EXISTS ensemble_type (
    type VARCHAR NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS ensemble_type_uidx ON ensemble_type(type);

CREATE SEQUENCE ensemble_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS ensemble (
    id BIGINT NOT NULL DEFAULT nextval('ensemble_id_seq'),
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL REFERENCES ensemble_type(type) ON DELETE CASCADE,
    description VARCHAR
);

CREATE UNIQUE INDEX IF NOT EXISTS ensemble_id_uidx ON ensemble(id);
CREATE UNIQUE INDEX IF NOT EXISTS ensemble_name_uidx ON ensemble(name);

CREATE TABLE IF NOT EXISTS ensemble_musician (
    ensemble_id BIGINT NOT NULL REFERENCES ensemble(id),
    musician_id BIGINT NOT NULL REFERENCES musician(id)
);
CREATE INDEX IF NOT EXISTS ensemble_id_idx ON ensemble_musician(ensemble_id);
CREATE INDEX IF NOT EXISTS ensemble_musician_id_idx ON ensemble_musician(musician_id);
CREATE UNIQUE INDEX IF NOT EXISTS ensemble_musician_uidx ON ensemble_musician(ensemble_id, musician_id);

CREATE SEQUENCE composition_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS composition (
    id BIGINT NOT NULL DEFAULT nextval('composition_id_seq'),
    name VARCHAR NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE,
    ensemble_id BIGINT NOT NULL REFERENCES ensemble(id) ON DELETE CASCADE,
    description VARCHAR
);

CREATE UNIQUE INDEX IF NOT EXISTS composition_id_uidx ON composition(id);