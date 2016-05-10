SELECT xt.create_table('purchauths', 'purchauths', false);

SELECT xt.add_column('purchauths', 'purchauths_id', 'serial', 'NOT NULL', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_username', 'text', 'NOT NULL', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_vendor_id', 'integer', 'NOT NULL DEFAULT (-1)', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_plancode_id', 'integer', 'NOT NULL DEFAULT (-1)', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_costcat_id', 'integer', 'NOT NULL DEFAULT (-1)', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_item_id', 'integer', 'NOT NULL DEFAULT (-1)', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_expcat_id', 'integer', 'NOT NULL DEFAULT (-1)', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_maxlevel', 'numeric', 'NOT NULL DEFAULT 0.00', 'purchauths', null);
SELECT xt.add_column('purchauths', 'purchauths_maxlevel_monthly', 'numeric', 'NOT NULL DEFAULT 0.00', 'purchauths', null);

SELECT xt.add_constraint('purchauths', 'pk_purchauths', 'PRIMARY KEY (purchauths_id)', 'purchauths');


ALTER TABLE purchauths.purchauths OWNER TO admin;
GRANT ALL ON TABLE purchauths.purchauths TO xtrole;

GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO admin;
GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO xtrole;

UPDATE purchauths.purchauths SET purchauths_maxlevel_monthly = purchauths_maxlevel WHERE purchauths_maxlevel_monthly = 0.00;

