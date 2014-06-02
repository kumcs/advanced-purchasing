var purchauth;
if (!purchauth)
  purchauth = new Object;

purchauth.errorCheck = function (q)
{
  if (q.lastError().type != QSqlError.NoError)
  {
    QMessageBox.critical(mywindow, qsTr("Database Error"),
                         q.lastError().text);
    return false;
  }

  return true;
}

