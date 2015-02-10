DO $$
-- Copyright (c) 2015 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _statement	TEXT;
  	
BEGIN

-- Check existence of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='purchauthsrelease'
                AND relnamespace=pg_namespace.oid
                AND nspname='purchauths')) THEN
                
      -- Do Nothing
      
  ELSE              
 -- Create New Table 
    _statement = 'CREATE TABLE purchauths.purchauthsrelease
    (
      purchauthsrel_id serial NOT NULL,
      purchauthsrel_pohead_id INTEGER NOT NULL,
      purchauthsrel_username text NOT NULL,
      CONSTRAINT pk_purchauthsrelease PRIMARY KEY (purchauthsrel_id),
      CONSTRAINT purchauthsrel_pohead_fk FOREIGN KEY (purchauthsrel_pohead_id)
        REFERENCES pohead (pohead_id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
    )
    WITH ( OIDS=FALSE );';

    EXECUTE _statement;
  END IF;


END;
$$;

ALTER TABLE purchauths.purchauthsrelease OWNER TO admin;
GRANT ALL ON TABLE purchauths.purchauthsrelease TO xtrole;

GRANT ALL ON TABLE purchauths.purchauthsrelease_purchauthsrel_id_seq TO admin;
GRANT ALL ON TABLE purchauths.purchauthsrelease_purchauthsrel_id_seq TO xtrole;


