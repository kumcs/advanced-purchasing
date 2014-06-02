var _list = mywindow.list();

_list["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

// context menu
function populateMenu(pMenu, pItem, pCol)
{
  var mCode
  if(pMenu == null)
    pMenu = _list.findChild("_menu");

  if(pMenu != null)
  {
    var _addsep = false;
    var currentItem = _list.currentItem();
    if(currentItem != null)
    {

      var canMaintain = (pItem.rawValue("pohead_status").toString() == "U" && privileges.check("MaintainPurchaseOrders")) ||
                     (pItem.rawValue("pohead_status").toString() == "O" && privileges.check("MaintainPurchaseOrders") && privileges.check("MaintainPostedPurchaseOrders"));

      pMenu.clear();

      mCode = pMenu.addAction(qsTr("Print..."));
      mCode.enabled = pItem.rawValue("pohead_status").toString() == "O" && privileges.check("MaintainPurchaseOrders") && privileges.check("MaintainPostedPurchaseOrders");
      mCode.triggered.connect(sPrint);

      pMenu.addSeparator();

      mCode = pMenu.addAction(qsTr("Edit..."));
      mCode.enabled = canMaintain;
      mCode.triggered.connect(sEdit);
      
      mCode = pMenu.addAction(qsTr("View..."));
      mCode.enabled = (canMaintain || privileges.check("ViewPurchaseOrders"));
      mCode.triggered.connect(sView);
      
      mCode = pMenu.addAction(qsTr("Delete..."));
      mCode.enabled = pItem.rawValue("pohead_status").toString() == "U" && privileges.check("MaintainPurchaseOrders");
      mCode.triggered.connect(sDelete);

      pMenu.addSeparator();

      mCode = pMenu.addAction(qsTr("Release..."));
      mCode.enabled = pItem.rawValue("pohead_status").toString() == "U" && privileges.check("ReleasePurchaseOrders");
      mCode.triggered.connect(sRelease);

// Add xtConnect EDI Menu.  Had to do this because we clear and rebuild the menu in this script, and I could not
// reference the functionality in a separate package   - xtConnect 3.7.0 functionality
      if (metrics.boolean("EnableBatchManager"))
      {
        var enableEDI = false;
        var params = new Object;
        params.pohead_id = _list.id();

        var qry = toolbox.executeQuery("SELECT xtbatch.getEdiProfileId('PO',"
                                     + " <? value('pohead_id') ?>) AS result;",
                                     params);
        if (qry.first())
          enableEDI = (qry.value("result") >= 0) && pItem.rawValue("pohead_status").toString() == "O";
        else if (qry.lastError.type != QSqlError.NoError)
          throw new Error(qry.lastError.text);

        var ediAct = pMenu.addAction(qsTr("Send Electronic Purchase Order..."));
        ediAct.enabled = enableEDI && privileges.value("PrintPurchaseOrders");
        ediAct.triggered.connect(sSubmitEDI);
      }

    }
  }
}

function sPrint()
{
  mywindow.sPrint();
}

function sEdit()
{
  mywindow.sEdit();
}

function sView()
{
  mywindow.sView();
}

function sDelete()
{
  mywindow.sDelete();
}

function sRelease()
{
  mywindow.sRelease();
}



