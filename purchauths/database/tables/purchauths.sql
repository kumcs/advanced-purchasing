DO $$
-- Copyright (c) 2015 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _statement	TEXT;
  	
BEGIN

-- Check existence of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='purchauths'
                AND relnamespace=pg_namespace.oid
                AND nspname='purchauths')) THEN
                
      -- Do Nothing
      
  ELSE              
 -- Create New Table 

    _statement = 'CREATE TABLE purchauths.purchauths
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

    EXECUTE _statement;

  END IF;

END;
$$;

ALTER TABLE purchauths.purchauths OWNER TO admin;
GRANT ALL ON TABLE purchauths.purchauths TO xtrole;

GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO admin;
GRANT ALL ON TABLE purchauths.purchauths_purchauths_id_seq TO xtrole;


DO $$
DECLARE
  _statement TEXT := '';
BEGIN

-- Check existance of column in table  
  IF (EXISTS(SELECT column_name
               FROM information_schema.columns 
               WHERE table_schema = 'purchauths' 
               AND table_name='purchauths' 
               AND column_name='purchauths_maxlevel_monthly')) THEN
                
      -- Do Nothing
      
  ELSE              
 -- Create New Column
    _statement = 'ALTER TABLE purchauths.purchauths ADD COLUMN purchauths_maxlevel_monthly NUMERIC NOT NULL DEFAULT 0.00;';
    EXECUTE _statement;
 
 -- Set initial monthly values to the individual PO value  
    UPDATE purchauths.purchauths SET purchauths_maxlevel_monthly = purchauths_maxlevel WHERE purchauths_maxlevel_monthly = 0.00;     
  END IF;
END;
$$;
