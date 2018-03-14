# bamazon
The bamazon project simulates a retail storefront where customers can buy goods and managers and supervisors manage their inventory and sales metrics.  It features three portals, each with a menu of options specific to that users use case:

## Customer portal
The customer portal is accessed by simply running *node CLI.js* it:
* Displays a list of available products 
* Allows the customer to input an item id for purchase
* Checks available inventory
* Either fulfills or rejects the order based on available inventory and if fulfilled, prints a total
* Offers for the customer to continue shopping or end their session

## Manager portal
The manager portal is accessed by runing *node CLI.js manager* it provides selections for a manger to
* Display a list of products for sale and the quantity in stock
* View a list of products that have low inventory (under 5 items in stock)
* Add inventory to an existing product
* Add a new product available for sale
* End their session

## Supervisor portal
The supervisor portal is accessed by running *node CLI.js supervisor* it provides selections for a supervisor to
* Display a sales table broken down by department and displaying departmental costs, departmental sales, and the profits for that department
* Create a new department

A working demo of these portals and the associated features can be found at the following location:
https://github.com/ThatchCorduroy/bamazon/blob/master/bamazon.mp4
