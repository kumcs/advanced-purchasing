CREATE OR REPLACE FUNCTION purchauths.returnpurchasingauth(integer)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 2013 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;
  _rec 		RECORD;
BEGIN

  FOR _rec IN
    SELECT poitem_id FROM poitem
      WHERE poitem_pohead_id = pPoheadid
  LOOP

   IF (NOT purchauths.returnitempurchasingauth(_rec.poitem_id)) THEN
	RETURN false;
   END IF;	

  END LOOP;     

  RETURN true;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION purchauths.returnpurchasingauth(integer)
  OWNER TO admin;
GRANT ALL ON FUNCTION purchauths.returnpurchasingauth(integer)
  TO xtrole;

