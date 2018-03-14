function Database () {
    this.mysql = require("mysql");
    this.connection;

    this.connectionInit = function() {
        var inquirer = require("inquirer");
        
        this.connection = this.mysql.createConnection({
          host: "localhost",
          port: 3306,
          user: "root",
          password: "root",
          database: "bamazonDB"
        });
    };
    
    this.connectionConnect = function() {
        var that = this;
        this.connection.connect(function(err) {
            if (err) throw err;
        }); 
    };

    this.connectionEnd = function() {
        this.connection.end();
    };

    this.connectionInit();
    this.connectionConnect();
};

function Inventory() {
    this.database = new Database;
    this.table = require("table");

    this.printCustomerTable = function() {
        var that = this;
        var query = this.database.connection.query("SELECT * FROM products", function(err, res) {
            var data = [["item_id", "product_name", "department_name", "price"]];
            var output;
    
            if (err) throw err;
    
            for (rownum in res) {
                var item_id = res[rownum].item_id;
                var product_name = res[rownum].product_name;
                var department_name = res[rownum].department_name;
                var price = res[rownum].price;
    
                data.push([item_id, product_name, department_name, price]);
            }
    
            output = that.table.table(data);
            console.log(output);
        });
    };

    this.printManagerTable = function() {
        var that = this;
        var getTable = new Promise (function(resolve, reject) {
            var query = that.database.connection.query("SELECT * FROM products", function(err, res) {
                var data = [["item_id", "product_name", "price", "stock_quantity"]];
                var output;
        
                if (err) throw err;
        
                for (rownum in res) {
                    var item_id = res[rownum].item_id;
                    var product_name = res[rownum].product_name;
                    var price = res[rownum].price;
                    var stock_quantity = res[rownum].stock_quantity;
        
                    data.push([item_id, product_name, price, stock_quantity]);
                }
        
                output = that.table.table(data);
                console.log(output);
                resolve(output);
            });

        });
        return getTable;
    };

    this.printSupervisorTable = function() {
        var that = this;
        var getTable = new Promise (function(resolve, reject) {
            var query = that.database.connection.query(
                "SELECT departments.department_id, \
                        departments.department_name, \
                        departments.over_head_costs, \
                        department_sales.product_sales, \
                        (department_sales.product_sales - departments.over_head_costs) as total_profit \
                FROM departments \
                LEFT JOIN (\
                    SELECT department_name, \
                           SUM(product_sales) as product_sales \
                    FROM products \
                    GROUP BY department_name) \
                    as department_sales \
                ON departments.department_name = department_sales.department_name", function(err, res) {

                var data = [["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]];
                var output;
        
                if (err) throw err;
        
                for (rownum in res) {
                    var department_id = res[rownum].department_id;
                    var department_name = res[rownum].department_name;
                    var over_head_costs = res[rownum].over_head_costs;
                    var product_sales = res[rownum].product_sales;
                    var total_profit = res[rownum].total_profit;
        
                    data.push([department_id, department_name, over_head_costs, product_sales, total_profit]);
                }
        
                output = that.table.table(data);
                console.log(output);
                resolve(output);
            });

        });
        return getTable;
    };       
    
    this.checkInventory = function(item_id, quantity) {
        var that = this;
        var getInvStatus = new Promise (function(resolve, reject) {
            
            var query = "SELECT stock_quantity FROM products WHERE ?";
            that.database.connection.query(query, {item_id: item_id}, function(err, res) {
                var stock_quantity = res[0].stock_quantity
                var invStatus = false;

                if (stock_quantity > quantity) {
                    invStatus = true;
                }
                
                resolve(invStatus);
            })
        })
        return getInvStatus; 
    };

    this.adjustInventory = function(item_id, quantity, operator) {
        var that = this;
        var getDone = new Promise (function(resolve, reject) {

            var query = "UPDATE products SET stock_quantity = stock_quantity " + operator + " " + quantity + "  WHERE ?";
            that.database.connection.query(query, {item_id: item_id}, function(err, res) {
                resolve(res);
            });
        });
        return getDone;
    };

    this.getItem_Ids = function() {
        var that = this;
        var getIds = new Promise (function(resolve, reject) {
            var item_ids = [];
            var query = that.database.connection.query("SELECT item_id FROM products", function(err, res) {
                if (err) throw err;
                res.forEach(function(value) {
                    item_ids.push(value.item_id);
                });
                resolve(item_ids);
            });
        })
        return getIds;
    };

    this.getItemPrice = function(item_id) {
        var that = this;
        var getPrice = new Promise (function(resolve, reject) {
            var query = "SELECT price FROM products WHERE ?";
            that.database.connection.query(query, {item_id: item_id}, function(err, res) {
                price = res[0].price;
                resolve(price);
            });
        })
        return getPrice;
    };

    this.getLowInventory = function() {
        var that = this;
        var getLow = new Promise (function(resolve, reject) {
            var query = "SELECT * FROM products WHERE stock_quantity < 5";
            that.database.connection.query(query, function(err, res) {
                var data = [["item_id", "product_name", "price", "stock_quantity"]];
                var output;
        
                if (err) throw err;
        
                for (rownum in res) {
                    var item_id = res[rownum].item_id;
                    var product_name = res[rownum].product_name;
                    var price = res[rownum].price;
                    var stock_quantity = res[rownum].stock_quantity;
        
                    data.push([item_id, product_name, price, stock_quantity]);
                }
        
                output = that.table.table(data);
                console.log(output);
                resolve(output);
            })
        })

        return getLow;
    };

    this.addProduct = function(name, dept, price, quantity) {
        var that = this;
        var addProd = new Promise (function(resolve, reject) {
            
            var query = "INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES(?,?,?,?,0)";
            that.database.connection.query(query, [name, dept, price, quantity], function(err, res) {
                resolve(res);
            });
        });
        return addProd;
    };

    this.addDepartment = function(name, costs) {
        var that = this;
        var addDept = new Promise (function(resolve, reject) {
            
            var query = "INSERT INTO departments (department_name, over_head_costs) VALUES(?,?)";
            that.database.connection.query(query, [name, costs], function(err, res) {
                resolve(res);
            });
        });
        return addDept;
    };

    this.addSale = function(item_id, total) {
        var that = this;

        var query = "UPDATE products SET product_sales = product_sales + ? WHERE ?";
        
        this.database.connection.query(query, [total, item_id])
    };
}

module.exports = Inventory;