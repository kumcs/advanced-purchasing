var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _user = mywindow.findChild("_user");
var _vendor = mywindow.findChild("_vendor");
var _plancode = mywindow.findChild("_plancode");
var _costcat = mywindow.findChild("_costcat");
var _expcat = mywindow.findChild("_expcat");
var _item = mywindow.findChild("_item");
var _level = mywindow.findChild("_level");
var _monthly = mywindow.findChild("_monthly");
var _stack = mywindow.findChild("_stack");

var _selItem = mywindow.findChild("_selItem");
var _selExpense = mywindow.findChild("_selExpense");

var _mode;
var _id;
var _newMode = 0;
var _editMode = 1;
var _viewMode = 2;

// connections
_close.clicked.connect(close);
_save.clicked.connect(saveAuth);
_level["editingFinished()"].connect(setButtons);
_monthly["editingFinished()"].connect(setButtons);
_selItem.clicked.connect(setWidgets);
_selExpense.clicked.connect(setWidgets);

setButtons();
setWidgets()

function close()
{
  mywindow.close();
}

function saveAuth()
{
  if (!checkData())
    return false;

  if (_monthly.baseValue < _level.baseValue) {
    QMessageBox.information(mywindow, qsTr("Incorrect Data"), qsTr("You must enter a monthly limit equal or higher than the individual P/O limit."));
    _monthly.setFocus();
    return false;
  }

  if (_mode == _newMode)
  {
    var sql="INSERT INTO purchauths.purchauths (purchauths_username, purchauths_vendor_id, purchauths_plancode_id, purchauths_costcat_id, purchauths_expcat_id, purchauths_item_id, purchauths_maxlevel, purchauths_maxlevel_monthly) "
	+ " VALUES (<? value('user') ?>, <? value('vendor') ?>,<? value('plancode') ?>, <? value('costcat') ?>, <? value('expcat') ?>, <? value('item') ?>, <? value('level') ?>, <? value('monthly') ?>)";
  } else {
    var sql="UPDATE purchauths.purchauths SET purchauths_vendor_id=<? value('vendor') ?>, purchauths_plancode_id=<? value('plancode') ?>, "
	+ "  purchauths_costcat_id=<? value('costcat') ?>, purchauths_expcat_id=<? value('expcat') ?>, purchauths_item_id=<? value('item') ?>, "
	+ " purchauths_maxlevel=<? value('level') ?>, purchauths_maxlevel_monthly=<? value('monthly') ?> WHERE purchauths_id=<? value('id') ?>";
  }  
  try
  {
    var d=toolbox.executeQuery(sql, getParams());
    mainwindow.sSalesOrdersUpdated(-1);
    close();
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, mywindow.windowTitle,e);
  }   
}

function checkData()
{
  if (!_user.isValid())
    return false;

  if (_level.baseValue <= 0)
    return false;


  return true;
}

function getParams()
{
  var p= new Object();
  p.id = _id;
  p.user = _user.text;
  p.vendor = _vendor.id();
  if (_selExpense.checked)
  {
    p.expcat = _expcat.id();
    p.item = -1;
  }
  if (_selItem.checked)
  {
    p.costcat = _costcat.id();
    p.plancode = _plancode.id();
    p.item = _item.id();
    p.expcat = -1;
  }
  p.level = _level.baseValue;
  p.monthly = _monthly.baseValue;

  return p;
}

function setButtons()
{
  _save.setEnabled(checkData());
}

function prepare()
{
  // do nothing
}

function setWidgets()
{
  if (_selItem.checked)
    _stack.setCurrentIndex(0);
  else
    _stack.setCurrentIndex(1);

  _plancode.enabled = _selItem.checked;
  _costcat.enabled = _selItem.checked;
  _item.enabled = _selItem.checked;
  _expcat.enabled = !_selItem.checked;
}

function populate(id)
{
  var p = new Object();
  p.id = id;
  _id  = id;
  var sql = 'SELECT * FROM purchauths.purchauths WHERE purchauths_id = <? value("id") ?>';
  var data = toolbox.executeQuery(sql, p);
  if (data.first())
  {
   _user.setText(data.value("purchauths_username"));
   _vendor.setId(data.value("purchauths_vendor_id"));
   _costcat.setId(data.value("purchauths_costcat_id"));
   _expcat.setId(data.value("purchauths_expcat_id"));
   _plancode.setId(data.value("purchauths_plancode_id"));
   _item.setId(data.value("purchauths_item_id"));
   _level.baseValue = data.value("purchauths_maxlevel");
   _monthly.baseValue = data.value("purchauths_maxlevel_monthly");
   _user.setEnabled(false);

   if (_item.id() > 0)
     _selItem.setChecked(true)
   else
     _selExpense.setChecked(true);   

   setWidgets();
   setButtons();
  }
}

function set(input)
{
 if ("mode" in input)
 {
  _mode = input.mode;
  if (_mode == _newMode)
    prepare();

  if (_mode == _editMode)
    populate(input.id);
 }
 return 0;
}