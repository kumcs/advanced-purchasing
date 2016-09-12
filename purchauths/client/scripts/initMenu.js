var tmpaction;

if (metrics.boolean("UsePurchasingAuths"))
{
  var purchasingMenu = mainwindow.findChild("menu.purch.orders");

  tmpaction = purchasingMenu.addAction(qsTranslate("menuPurchase", "Purchasing Authorizations..."));
  if (privileges.value("MaintainPurchasingAuths") || privileges.value("ViewPurchasingAuths"))
    tmpaction.enabled = true;
  tmpaction.setData("purchauthsList");
  tmpaction.objectName = "pu.purchauths";
  tmpaction.triggered.connect(sPurchasingAuths);
}

function sPurchasingAuths()
{
    toolbox.openWindow("purchauthsList", 0, Qt.NonModal, Qt.Window);
}