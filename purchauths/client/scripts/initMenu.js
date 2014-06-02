// change the search_path to ensure existing client code works with overload functions
var qry = toolbox.executeQuery("SHOW search_path;", new Object);
if (! qry.first())
  toolbox.messageBox("critical", mainwindow, qsTr("Initialize purchaseauths failed"),
                     qsTr("Failed to initialize the purchaseauths package. "
                        + "This functionality may not work correctly. ")
                        .arg(qry.lastError().databaseText));
else
{
  // If the search path is empty set the base value to public
  var search_path = qry.value("search_path");
  if(search_path == "")
  {
    search_path = "public";
  }

  // Prepend xtmfg to the existing search path.
  qry = toolbox.executeQuery("SET search_path TO purchauths, " + search_path + ";", new Object);
}

var tmpaction;

if (metrics.boolean("UsePurchasingAuths"))
{
  var purchasingMenu = mainwindow.findChild("menu.purch.orders");

  tmpaction = purchasingMenu.addAction(qsTranslate("menuPurchase", "Purchasing Authorizations..."));
  tmpaction.enabled = privileges.value("MaintainPurchasingAuths") || privileges.value("ViewPurchasingAuths");
  tmpaction.setData("purchauthsList");
  tmpaction.objectName = "pu.purchauths";
  tmpaction.triggered.connect(sPurchasingAuths);

}

function sPurchasingAuths()
{
    toolbox.openWindow("purchauthsList", 0, Qt.NonModal, Qt.Window);
}