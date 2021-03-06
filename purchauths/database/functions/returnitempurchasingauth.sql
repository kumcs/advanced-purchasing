CREATE OR REPLACE FUNCTION purchauths.returnitempurchasingauth(integer)
  RETURNS boolean AS
$BODY$
-- Copyright (c) 2013-2015 by Pentuple Consulting (New Zealand) www.pentuple.co.nz. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPoitemid ALIAS FOR $1;
  _rec 		RECORD;
  _authrec	RECORD;
  _itemsite	RECORD;
  _monthly	NUMERIC;
BEGIN

  SELECT pohead_vend_id, poitem.poitem_id, poitem.poitem_itemsite_id, poitem.poitem_expcat_id,
       (poitem_qty_ordered * poitem_unitprice) as poitem_value INTO _rec
  FROM poitem
  JOIN pohead ON (poitem_pohead_id = pohead_id)
  WHERE poitem_id = pPoitemid;

  -- Monthly Spend
  SELECT COALESCE(SUM(poitem_qty_ordered * poitem_unitprice),0.00) INTO _monthly
  FROM pohead
  JOIN purchauths.purchauthsrelease ON (pohead_id=purchauthsrel_pohead_id)
  JOIN poitem ON (pohead_id=poitem_pohead_id)
  WHERE ((pohead_released BETWEEN (SELECT period_start FROM period WHERE current_date BETWEEN period_start AND period_end)
                         AND (SELECT period_end FROM period WHERE current_date BETWEEN period_start AND period_end))
    AND (purchauthsrel_username = geteffectivextuser())
    AND (poitem_itemsite_id =_rec.poitem_itemsite_id
         OR poitem_expcat_id = _rec.poitem_expcat_id));   

  IF (_rec.poitem_itemsite_id IS NOT NULL) THEN
  -- Check Authorisation by Item
    SELECT itemsite_item_id as item, itemsite_costcat_id as costcat, itemsite_plancode_id as plancode 
      INTO _itemsite 
    FROM itemsite 
    WHERE itemsite_id=_rec.poitem_itemsite_id;
  
    IF NOT EXISTS(SELECT 1 
       FROM purchauths.purchauths
       WHERE (purchauths_username = geteffectivextuser()
         AND (purchauths_item_id = _itemsite.item 
	   OR (purchauths_expcat_id = -1 AND purchauths_item_id = -1))
	 AND ( purchauths_costcat_id = _itemsite.costcat OR purchauths_costcat_id = -1)
         AND (purchauths_plancode_id = _itemsite.plancode  OR purchauths_plancode_id = -1)
	 AND (purchauths_vendor_id = _rec.pohead_vend_id OR purchauths_vendor_id = -1)  
	 AND purchauths_maxlevel >= _rec.poitem_value
	 AND purchauths_maxlevel_monthly >= (_monthly + _rec.poitem_value))
       ORDER BY purchauths_item_id DESC,
		purchauths_costcat_id DESC,
		purchauths_plancode_id DESC
       LIMIT 1) THEN
         RETURN false;
     END IF;    

  ELSIF (_rec.poitem_expcat_id IS NOT NULL) THEN
  -- Check Authorisation by Expense Category
     IF NOT EXISTS(SELECT 1 
       FROM purchauths.purchauths
       WHERE (purchauths_username = geteffectivextuser()
         AND (purchauths_expcat_id = _rec.poitem_expcat_id 
	   OR (purchauths_expcat_id = -1 AND purchauths_item_id = -1
		AND purchauths_costcat_id = -1 AND purchauths_plancode_id = -1))
	 AND (purchauths_vendor_id = _rec.pohead_vend_id
	   OR purchauths_vendor_id = -1)  
	 AND purchauths_maxlevel >= _rec.poitem_value
	 AND purchauths_maxlevel_monthly >= (_monthly + _rec.poitem_value))	 
       ORDER BY purchauths_expcat_id DESC 
       LIMIT 1 ) THEN
         RETURN false;
     END IF;    	 
  ELSE
  -- Neither item or expense category - raise Error
     RAISE EXCEPTION 'Neither Item or Expense Category found on this PO. Authorisation cannot be checked';
     RETURN false;   
  END IF;
    
  RETURN true;

END;
$BODY$
  LANGUAGE plpgsql;
  
ALTER FUNCTION purchauths.returnitempurchasingauth(integer) OWNER TO admin;
GRANT EXECUTE ON FUNCTION purchauths.returnitempurchasingauth(integer) TO admin;
GRANT EXECUTE ON FUNCTION purchauths.returnitempurchasingauth(integer) TO xtrole;
