CREATE OR REPLACE FUNCTION purchauths.updatetable()
  RETURNS boolean AS
$BODY$
-- Copyright (c) 2013 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _sql	TEXT;
  	
BEGIN

  _sql = 'CREATE TABLE purchauths.purchauths
  (
    purchauths_id serial NOT NULL,
    purchauths_username text NOT NULL,
    purchauths_vendor_id integer NOT NULL DEFAULT (-1),
    purchauths_plancode_id integer NOT NULL DEFAULT (-1),
    purchauths_costcat_id integer NOT NULL DEFAULT (-1),
    purchauths_item_id integer NOT NULL DEFAULT (-1),
    purchauths_expcat_id integer NOT NULL DEFAULT (-1),
    purchauths_maxlevel numeric NOT NULL DEFAULT 0.00,
   CONSTRAINT pk_purchauths PRIMARY KEY (purchauths_id )
  )
  WITH ( OIDS=FALSE );';

  IF ((select count(*) from pg_tables where schemaname='purchauths' and tablename = 'purchauths') = 0) THEN  
    EXECUTE _sql;
    return true;
  END IF;

  return false;

END;
$BODY$
  LANGUAGE plpgsql;

SELECT purchauths.updatetable();
DROP FUNCTION purchauths.updatetable();

ALTER TABLE purchauths.purchauths OWNER TO admin;
GRANT ALL ON TABLE purchauths.purchauths TO xtrole;

GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO admin;
GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO xtrole;

