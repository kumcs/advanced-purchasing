include("purchauth");
purchauth.purchaseorderitem = new Object;

var _unitPrice = mywindow.findChild("_unitPrice");
var _item = mywindow.findChild("_item");
var _expcat = mywindow.findChild("_expcat");

var _status;

function handleUnitPricing()
{
  if (!metrics.boolean("UsePurchasingAuths"))
    return;

  var _poitem = mywindow.id();

  var _postatus = toolbox.executeQuery("SELECT pohead_status FROM pohead JOIN poitem ON (poitem_pohead_id=pohead_id) WHERE poitem_id=<? value('poitem') ?>", {poitem: _poitem});
  if (purchauth.errorCheck(_postatus) && _postatus.first())
     _status = _postatus.value("pohead_status");
  else
    return;

  if (_status == 'U')
    return;

  if (!privileges.check("OverrideReleasedPOPrices"))
    _unitPrice.setEnabled(false);
}

_item["newId(int)"].connect(handleUnitPricing);
_expcat["newId(int)"].connect(handleUnitPricing);