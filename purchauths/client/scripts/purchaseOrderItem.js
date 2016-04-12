include("purchauth");
purchauth.purchaseorderitem = new Object;

var _unitPrice = mywindow.findChild("_unitPrice");

var _mode;
var _po;
var _poStatus;

function set(input)
{
  if ("mode" in input)
    _mode = input.mode;
  if ("pohead_id" in input)
  {
    _po = input.pohead_id
    var _pohead = toolbox.executeQuery("SELECT pohead_status FROM pohead WHERE pohead_id=<? value('po') ?>", {po: _po});
    if (purchauth.errorCheck(_pohead) && _pohead.first())
     _poStatus = _pohead.value("pohead_status");
  }

  if (_mode != "new" && _poStatus != "U")
    handleUnitPricing();
}

function handleUnitPricing()
{
  if (!metrics.boolean("UsePurchasingAuths"))
    return;

  if (!privileges.check("OverrideReleasedPOPrices"))
    _unitPrice.setEnabled(false);
}