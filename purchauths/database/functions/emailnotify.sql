CREATE OR REPLACE FUNCTION purchauths.emailnotify(text)
  RETURNS boolean AS
$BODY$
DECLARE
  _po		ALIAS FOR $1;
  _orderid	INTEGER;
  _row		RECORD;
  _email    	TEXT;
  _subject	TEXT;
  _body		TEXT;
BEGIN

  IF (fetchMetricBool('EnableBatchManager')) THEN

    SELECT pohead_id INTO _orderid
      FROM pohead WHERE pohead_number = _po;
    
--  Only send email to manager if the PO cannot be authorised by the current user
    IF (purchauths.returnpurchasingauth(_orderid)) THEN
      return true;  -- is authorised    
    END IF;
    
    SELECT TRIM(cntct_email) INTO _email
	FROM cntct
	JOIN emp ON (cntct_id=emp_cntct_id)
	WHERE emp_id = (select emp_mgr_emp_id FROM emp WHERE emp_code=geteffectivextuser());

    IF (FOUND) THEN
      SELECT order_number, order_date, purchasing_agent, vendor_number INTO _row 
      FROM pohead 
      JOIN api.purchaseorder a ON (pohead_number=order_number) 
      WHERE pohead_number = _po;
      
      SELECT '[xTuple Purchasing]: Purchase Order #' || _row.order_number || ' Authorization' AS subject, 
        'Purchase Order #' || _row.order_number || ' was created at ' || to_char(current_timestamp, 'YYYY-MM-DD HH:mm') ||
        ' by ' || geteffectivextuser() || '.
Vendor: '|| _row.vendor_number || '
Order Date: '|| _row.order_date ||'
Purchasing Agent: ' || _row.purchasing_agent || '.

Please check and authorize this Purchase Order.' AS body    
        INTO _subject, _body;

      PERFORM xtbatch.submitEmailtoBatch(_email,_email, null,_subject,_body,null,now(),false);
    END IF;
  END IF;

  RETURN true;

END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION purchauths.emailnotify(text)
  OWNER TO xtrole;
