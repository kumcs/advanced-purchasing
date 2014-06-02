var _agent = mywindow.findChild("_agent");
var _release = mywindow.findChild("_release");
var _selectedAgent = mywindow.findChild("_selectedAgent");

function nRelease()
{
  var par = new Object();
  par.agent  = _agent.text;
  var sql = "SELECT DISTINCT pohead_number, purchauths.returnpurchasingauth(pohead_id) as auth"
           + "               FROM ( SELECT pohead_id, pohead_number , pohead_agent_username "
           + "             FROM pohead, poitem "
           + "            WHERE ( (poitem_pohead_id=pohead_id) "
           + "              AND   (poitem_status='U') ) ) AS data "
           + "   WHERE  (checkPOSitePrivs(pohead_id)) ";

  if (_selectedAgent.checked)
      	 sql +=   "     AND   (pohead_agent_username=<? value(\"agent\") ?>); ";

  var check = toolbox.executeQuery(sql, par);
  while(check.next())
    {
      if(check.value("auth") == false)
      {
        QMessageBox.warning(mywindow,qsTr("Purchasing Authorisations"), qsTr("You have insufficient authority to release Purchase Order " + check.value("pohead_number")));
        return false;
      }
    } 
  // Made it here so all PO's can be released
  mywindow.sRelease();
}

if (metrics.boolean("UsePurchasingAuths"))
{
  toolbox.coreDisconnect(_release, "clicked()", mywindow, "sRelease()");
  _release.clicked.connect(nRelease);
}