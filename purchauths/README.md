# Advanced Purchasing Authorities Package
<details>
<summary>Purchasing Advanced Authorities add-on package for xTuple ERP.</summary> This package was originally copyright (c) 2013-2016 by Pentuple Consulting New Zealand (www.pentuple.co.nz) and later copyright (c) 2015-2018 by xTuple ERP (www.xtuple.org).

## Details

The purpose of the package is to prevent the release of Purchase Orders unless the purchasing agent has the appropriate purchase authority level.  Standard xTuple has a single privilege to allow/not-allow releasing P/Os.

Purchase authority limits are set for each purchasing agent and can be based on a combination of item or expense category.  Limits can be tied to a specific vendor.  You can also use groups rather than specific items and restrict by planner code/cost category and is based on the value of items on a P/O.  Authorities are checked when attempting to release a P/O.  If the agent has an authority level that meets the item value of the P/O, the order can be released otherwise a warning message is displayed and the order is not released.

It is also possible to send an email notification to the P/O creator's manager if that is properly configured, AND xtConnect is also installed.

Version history:

- 1.1.0 - May 2013 Add Purchase Order email notifications (if xtConnect installed)
- 1.1.1 - June 2013 Fixed seqence Db permissions problem
- 1.2.0 - Feb 2015 Added Monthly Spend Limits (and recording of P/O Release user)
- 1.3.0 - Apr 2016 Prevent editing unit prices on Release PO without privilege
- 1.3.1/2 - Various tidyups and install bugfixes
</details>
