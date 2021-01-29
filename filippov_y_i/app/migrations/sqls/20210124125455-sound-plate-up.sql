CREATE SEQUENCE plate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS plate (
    id BIGINT NOT NULL DEFAULT nextval('plate_id_seq'),
    name VARCHAR NOT NULL,
    description VARCHAR,
    date TIMESTAMP WITHOUT TIME ZONE,
    produced_by VARCHAR NOT NULL,
    wholesaler VARCHAR NOT NULL,
    wholesale_price BIGINT NOT NULL, /*оптовая цена*/
    retail_price BIGINT NOT NULL /*розничная цена*/
);

CREATE UNIQUE INDEX IF NOT EXISTS plate_uidx ON plate(id);

CREATE TABLE IF NOT EXISTS composition_ensemble_plate (
    composition_id BIGINT NOT NULL REFERENCES composition(id),
    ensemble_id BIGINT NOT NULL REFERENCES ensemble(id),
    plate_id BIGINT NOT NULL REFERENCES plate(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS composition_ensemble_plate_uidx ON composition_ensemble_plate(composition_id, ensemble_id, plate_id);

CREATE TABLE IF NOT EXISTS plate_sale(
    plate_id BIGINT NOT NULL REFERENCES plate(id),
    sold_at TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO plate(name, date, produced_by, wholesaler, wholesale_price, retail_price, description) VALUES ('Bob Dylan - лучшие песни', '2018-05-13', 'EMI', 'Москва, улица Пушкина д. 13', 1900, 3499, 'Bob dylan является несомненно знаковым музыкантом для всей культуры, который внес большой вклад в ее развитие. В этой пластинке собраны лучшие песни музыканта, которые совершенно точно понравятся ценителям его музыки, а также отлично подойдут тем, кто только хочет ознакомиться с его произведениями');
INSERT INTO composition_ensemble_plate(composition_id, ensemble_id, plate_id) VALUES (1, 1, currval('plate_id_seq'));
INSERT INTO composition_ensemble_plate(composition_id, ensemble_id, plate_id) VALUES (2, 1, currval('plate_id_seq'));