// Copyright (c) 2013 Pentuple Consulting (New Zealand) www.pentuple.co.nz
// All rights Reserved.

var _usePurchAuths = toolbox.createWidget("QCheckBox", mywindow, "_usePurchAuths");
_usePurchAuths.text = qsTr("Use Purchasing Authorizations");

if (metrics.boolean("EnableBatchManager"))
{
   var _notify = toolbox.createWidget("QCheckBox", mywindow, "_notify");
   _notify.text = qsTr("Notify Manager of new POs");
}

var _layout = toolbox.widgetGetLayout(mywindow.findChild("_printPO"));

_layout.addWidget(_usePurchAuths,0,10);
if (metrics.boolean("EnableBatchManager"))
  _layout.addWidget(_notify,1,10); 

function configSave()
{
  metrics.set("UsePurchasingAuths", _usePurchAuths.checked);
  if (metrics.boolean("EnableBatchManager"))
      metrics.set("PurchasingAuthsEmail", _notify.checked); 
}

mywindow.saving.connect(configSave);

_usePurchAuths.checked = metrics.boolean("UsePurchasingAuths");
if (metrics.boolean("EnableBatchManager"))
    _notify.checked = metrics.boolean("PurchasingAuthsEmail");  
