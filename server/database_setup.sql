CREATE DATABASE foodproject;
SET password_encryption TO 'scram-sha-256';
CREATE ROLE foodproject;
ALTER ROLE foodproject WITH LOGIN;
ALTER ROLE foodproject WITH PASSWORD 'elrvjbenlrij';
GRANT ALL ON DATABASE foodproject TO foodproject;