var _po = mywindow.findChild("_po");
var _release = mywindow.findChild("_release");

function nRelease()
{
  var par = new Object();
  par.po  = _po.id();
  var check = toolbox.executeQuery("SELECT purchauths.returnpurchasingauth(<? value(\"po\") ?>) as ret", par);
  if (check.first())
  {
    if (check.value("ret") == true)
      mywindow.sRelease();
    else
    {
      QMessageBox.warning(mywindow,qsTr("Purchasing Authorisations"), qsTr("You have insufficient authority to release this Purchase Order."));
      return false;
    }
  }
}

if (metrics.boolean("UsePurchasingAuths"))
{
  toolbox.coreDisconnect(_release, "clicked()", mywindow, "sRelease()");
  _release.clicked.connect(nRelease);
}