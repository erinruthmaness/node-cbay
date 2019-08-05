var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "cbay_db"
})

connection.connect(function (err) {
    if (err) throw err;
    displayStock();
});

function displayStock() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var stock = [];
        for (var i = 0; i < res.length; i++) {
            stock[i] = {
                id: res[i].item_id,
                name: res[i].product_name,
                quantity: res[i].stock_quantity,
                price: res[i].price
            }
            console.log(res[i].item_id + ": " + res[i].product_name + " (Price: $" + res[i].price + ", " + res[i].stock_quantity + " in stock.)");
        }
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the Item # of the item you would like to buy.",
                name: "selection"
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity"
            }
        ])
            .then(function (response) {
                var qty = parseInt(response.quantity);
                for (var j in stock) {
                    if (stock[j].id === parseInt(response.selection)) {
                        var choice = stock[j].name;
                        var price = stock[j].price;
                        var inStock = stock[j].quantity;
                        if (inStock < qty) {
                            console.log("Invalid quantity. Only " + stock[j].quantity + " available.")
                            continuePrompt();
                        }
                        else if (qty === 0) {
                            console.log("Please enter a valid number.");
                            continuePrompt();
                        }
                        else {
                            makePurchase(choice, inStock, qty, price);
                        }
                    }
                }
            })
    });
}

function continuePrompt() {
    inquirer.prompt([
        {
            type:"confirm",
            message: "Would you like to make another purchase?",
            name: "repeat"
        }
    ]).then(function(response){
        if (response.repeat) {
            displayStock();
        }
        else {
            console.log("Thank you for shopping with cBay and not Amazon!");
            connection.end();
        }
    })
}

function makePurchase(choice, inStock, qty, price) {
    var totalCost = (price * qty).toFixed(2);
    console.log("Your cart: " + choice);
    console.log("Price: $" + price);
    console.log("Quantity: " + qty);
    console.log("--------------------------")
    console.log("Total Cost: $" + totalCost);
    inquirer.prompt([
        {
            type: "confirm",
            message: "Is this correct?",
            name: "purchase"
        }
    ]).then(function(response){
        if (response.purchase) {
            var stockLeft = inStock - qty;
            connection.query("UPDATE products SET stock_quantity = ? WHERE product_name = ?", [stockLeft, choice], function (err, res) {
                if (err) throw err;
                console.log("Purchase successful! " + stockLeft + " of " + choice + " still in stock.");
                continuePrompt();
            })
        }
        else {
            continuePrompt();
        }
    })
}