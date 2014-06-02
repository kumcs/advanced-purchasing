var _user = mywindow.findChild("_user");
var _close = mywindow.findChild("_close");
var _levels = mywindow.findChild("_levels");

var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _delete = mywindow.findChild("_delete");

// connections
_close.clicked.connect(close);
_new.clicked.connect(authNew);
_edit.clicked.connect(authEdit);
_delete.clicked.connect(authDelete);
_user["textChanged(QString)"].connect(fillList);
mainwindow["salesOrdersUpdated(int, bool)"].connect(fillList);

_new.enabled = privileges.check("MaintainPurchasingAuths");
_edit.enabled = privileges.check("MaintainPurchasingAuths");
_delete.enabled = privileges.check("MaintainPurchasingAuths");

// Create List
with (_levels)
{
  addColumn("User",  -1, 1, true, "purchauths_username");
  addColumn("Vendor",  -1, 1, true, "vendor");
  addColumn("Planner Code",  -1, 1, true, "plancode");
  addColumn("Cost Category",  -1, 1, true, "costcat");
  addColumn("Item",  -1, 1, true, "item");
  addColumn("Expense Category",  -1, 1, true, "expcat");
  addColumn("Purchasing Level",  -1, 1, true, "purchauths_maxlevel");
}

fillList();

_levels["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

// context menu
function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _levels.findChild("_menu");

if(pMenu != null)
 {
  var _addsep = false;
  var currentItem = _levels.currentItem();
  if(currentItem != null)
  {
   mCode = pMenu.addAction(qsTr("Edit..."));
   mCode.enabled = privileges.check("MaintainPurchasingAuths");
   mCode.triggered.connect(authEdit);

   mCode2 = pMenu.addAction(qsTr("Delete..."));
   mCode2.enabled = privileges.check("MaintainPurchasingAuths");
   mCode2.triggered.connect(authDelete);
  }
 }
}
 

function fillList()
{
 try
 {
  data = toolbox.executeDbQuery("purchAuths", "detail", getParams());
  _levels.populate(data);
 }
 catch(e)
 {
   print(e);
   QMessageBox.critical(mywindow, "Database Error", "Db Error: " + e);
 }
}

function close()
{
  mywindow.close();
}

function authNew()
{
 authOpen(0,0);
}

function authEdit()
{ 
 if (_levels.id() == -1)
 {
  QMessageBox.warning(mywindow, mywindow.windowTitle, "You must select a line first");
  return 0;
 }
 authOpen(1,_levels.id());
}

function authDelete()
{
 if (_levels.id() == -1)
 {
  QMessageBox.warning(mywindow, mywindow.windowTitle, "You must select a Purchasing Authorisation first");
  return 0;
 }
  var dparam = new Object();
  dparam.id = _levels.id();
  var data = toolbox.executeQuery('DELETE FROM purchauths.purchauths WHERE purchauths_id = <? value("id") ?>', dparam);
  
  fillList();
}

function authOpen(mode, number)
{
  try
  {
   var childwnd = toolbox.openWindow("purchauths",mywindow, 0, 1);
   var wparams = new Object;
   wparams.mode = mode;
   wparams.id = number;

   var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
   print(e);
   QMessageBox.critical(mywindow, mywindow.windowTitle, "An error occurred:" + e);
  }
}

function getParams()
{
 var par = new Object();
 if (_user.text.length != 0)
   par.user = "%"+_user.text+"%";

 return par;
}