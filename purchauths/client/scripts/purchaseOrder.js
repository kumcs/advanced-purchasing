include("purchauth");
purchauth.purchaseorder = new Object;

var _printPO = mywindow.findChild("_printPO");
var _status  = mywindow.findChild("_status");
var _save = mywindow.findChild("_save");
var _orderNumber = mywindow.findChild("_orderNumber");

var _mode;
var _po;

function set(input)
{
  if ("mode" in input)
    _mode = input.mode;
}

function showEvent()
{ 
  if (metrics.boolean("UsePurchasingAuths"))
  {
  // Prevent printing unreleased (or closed) POs  
    if (_status.currentIndex != 1)
    {
      _status.enabled = false; 
      _printPO.checked = false;
      _printPO.enabled = false;
    }        
  }
}

purchauth.purchaseorder.save = function ()
{

  mywindow.sSave();

  if (_mode == "new")
  {
  // Check xtConnect installed and if so send email
    if (metrics.boolean("EnableBatchManager") && metrics.boolean("UsePurchasingAuths") && metrics.boolean("PurchasingAuthsEmail"))
    {
       // send notification email
       var p = new Object();
       p.number = _orderNumber.text;
       var send = toolbox.executeQuery("SELECT purchauths.emailnotify(<? value(\"number\") ?>)", p);
       purchauth.errorCheck(send);
    }
  }
}

toolbox.coreDisconnect(_save, "clicked()", mywindow, "sSave()");
_save.clicked.connect(purchauth.purchaseorder.save);