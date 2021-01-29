CREATE TABLE IF NOT EXISTS admin (
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_email_uidx ON admin(email);

INSERT INTO admin (email, password) VALUES ('admin@admin.ru', '58b4e38f66bcdb546380845d6af27187');