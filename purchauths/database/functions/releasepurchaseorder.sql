CREATE OR REPLACE FUNCTION purchauths.releasepurchaseorder(integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoheadid ALIAS FOR $1;
  _number   TEXT;	
  ret	    INTEGER;	
BEGIN

  IF (NOT purchauths.returnpurchasingauth(pPoheadid)) THEN
      SELECT pohead_number INTO _number FROM pohead WHERE pohead_id=pPoheadid;
      
      RAISE EXCEPTION 'Insufficient Authority to release Purchase Order %', _number;
      RETURN -99;
  ELSE
      SELECT public.releasepurchaseorder(pPoheadid) INTO ret;
      RETURN ret;
  END IF;         

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION purchauths.releasepurchaseorder(integer)
  OWNER TO admin;
GRANT ALL ON FUNCTION purchauths.releasepurchaseorder(integer)
  TO xtrole;
