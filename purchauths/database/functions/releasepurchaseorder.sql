CREATE OR REPLACE FUNCTION purchauths.releasepurchaseorder(integer)
  RETURNS integer AS
$BODY$
-- Copyright (c) 2013-2015 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
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
      -- Use xTuple PO release process
      SELECT public.releasepurchaseorder(pPoheadid) INTO ret;
      IF (ret >= 0) THEN
      -- Also record who released the PO
        DELETE FROM purchauths.purchauthsrelease WHERE purchauthsrel_pohead_id = pPoheadid;
        INSERT INTO purchauths.purchauthsrelease (purchauthsrel_pohead_id, purchauthsrel_username)
          VALUES (pPoheadid, geteffectivextuser());
      END IF;  
      RETURN ret;
  END IF;         

END;
$BODY$
  LANGUAGE plpgsql;
  
ALTER FUNCTION purchauths.releasepurchaseorder(integer) OWNER TO admin;

GRANT EXECUTE ON FUNCTION purchauths.releasepurchaseorder(integer) TO admin;
GRANT EXECUTE ON FUNCTION purchauths.releasepurchaseorder(integer) TO public;
GRANT EXECUTE ON FUNCTION purchauths.releasepurchaseorder(integer) TO xtrole;
