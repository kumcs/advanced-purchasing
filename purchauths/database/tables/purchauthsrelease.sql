SELECT xt.create_table('purchauthsrelease', 'purchauths', false);

SELECT xt.add_column('purchauthsrelease', 'purchauthsrel_id', 'serial', 'NOT NULL', 'purchauths', null);
SELECT xt.add_column('purchauthsrelease', 'purchauthsrel_pohead_id', 'integer', 'NOT NULL', 'purchauths', null);
SELECT xt.add_column('purchauthsrelease', 'purchauthsrel_username', 'text', 'NOT NULL', 'purchauths', null);

SELECT xt.add_constraint('purchauthsrelease', 'pk_purchauthsrelease', 'PRIMARY KEY (purchauthsrel_id)', 'purchauths');
SELECT xt.add_constraint('purchauthsrelease', 'purchauthsrel_pohead_fk', 'FOREIGN KEY (purchauthsrel_pohead_id)
        REFERENCES pohead (pohead_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE', 'purchauths');

ALTER TABLE purchauths.purchauthsrelease OWNER TO admin;
GRANT ALL ON TABLE purchauths.purchauthsrelease TO xtrole;

GRANT ALL ON TABLE purchauths.purchauthsrelease_purchauthsrel_id_seq TO admin;
GRANT ALL ON TABLE purchauths.purchauthsrelease_purchauthsrel_id_seq TO xtrole;


