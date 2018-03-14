var OrderSession = require("./bamazonCustomer");
var ManagerSession = require("./bamazonManager");
var SupervisorSession = require("./bamazonSupervisor");

var logintype = process.argv[2];

switch (logintype) {
    case 'manager':
        var managerSession = new ManagerSession();
        managerSession.getCommand();
        break;
    case 'supervisor':
        var supervisorSession = new SupervisorSession();
        supervisorSession.getCommand();
        break;
    default:
        var customerOrder = new OrderSession();
        customerOrder.printProducts();
        customerOrder.getOrder();
}