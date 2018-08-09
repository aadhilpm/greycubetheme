# Copyright (c) 2018, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals, print_function
import frappe
import erpnext
from frappe.utils import add_to_date
from frappe.utils import flt, today, cint
from erpnext.utilities.page.leaderboard.leaderboard import get_leaderboard
from erpnext.accounts.utils import get_fiscal_year, now
import datetime
from frappe import _


@frappe.whitelist()
def get_property_status():
	data=frappe.db.sql("""select property_status As "Property Status",count(*) As Count from `tabProperty` group by property_status """)
	label=_('PROPERTY STATUS')
	if not data:
		return label,0
	else:
		return label,data

@frappe.whitelist()
def get_todays_transaction():
    cur_date = today()
    data = frappe.db.sql("""select transaction_type As "Transaction Type", count(*) As Count from `tabProperty Transaction` where transaction_date = %s and docstatus = 1 group by transaction_type """, (cur_date))
    label=_('Todays Transactions')
    if not data:
        return label,0
    else:
        return label,data

@frappe.whitelist()
def get_unpaid_client():
	data=frappe.db.sql("""select sum(commission_from_client) As "UnPaid From Client" from `tabProperty Transaction` where transaction_status in ("Non Payé" ,"Client non payé")""")[0]
	label=_('Unpaid Client')
	if not data:
		return label,0
	else:
		return label,data

@frappe.whitelist()
def get_unpaid_owner():
	data=frappe.db.sql("""select sum(commission_from_client) As "UnPaid From Client" from `tabProperty Transaction` where transaction_status in ("Non Payé" ,"Propriétaire non payé")""")[0]
	label=_('Unpaid Owner')
	if not data:
		return label,0
	else:
		return label,data

@frappe.whitelist()
def get_upcoming_rent_expiry_list():
    cur_date = today()
    data = frappe.db.sql("""select P.property_name AS Property , 
									PT.rent_end_date AS Expires,
									PT.customer AS Client,
									PT.telephone AS Telephone,
									PT.customer_email AS Email,P.name
							from `tabProperty`AS P INNER JOIN
							`tabProperty Transaction` AS PT
							ON PT.property = P.name
							where P.property_status = "Loué"
							and DATEDIFF (rent_end_date , CURDATE()) <= 60
							and PT.docstatus = 1""")
    label=_('List Of Properties Near Expiry')
    if not data:
        return label,0
    else:
        return label,data