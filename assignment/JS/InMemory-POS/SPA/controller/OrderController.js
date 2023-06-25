/*disable button*/
$("#btnAddToCart").attr('disabled', true);
$("#btnPlaceOrder").attr('disabled', true);

/*load customer ids to combobox*/
function loadAllCustomersForOption() {
    $("#inputCustomerID").empty();
    $("#inputCustomerID").prepend(`<option>Select ID</option>`);
    for (let cus of Customers) {
        $("#inputCustomerID").append(`<option>${cus.id}</option>`);
    }
}

/*load item ids to combobox*/
function loadAllItemsForOption() {
    $("#inputItemCode").empty();
    $("#inputItemCode").prepend(`<option>Select Code</option>`);
    for (let item of Items) {
        $("#inputItemCode").append(`<option>${item.code}</option>`);
    }
}

/*fill other textfields of customer*/
$("#inputCustomerID").change(function () {
    let cusID = $("#inputCustomerID").val();
    let customer = searchCustomer(cusID);
    if (customer != null) {
        $("#customerName").val(customer.name);
        $("#customerAddress").val(customer.address);
        $("#customerSalary").val(customer.salary);
    }
});

/*fill other textfields of items*/
$("#inputItemCode").change(function () {
    let itemCode = $("#inputItemCode").val();
    let item = searchItem(itemCode);
    if (item != null) {
        $("#itemName").val(item.name);
        $("#itemPrice").val(item.unitPrice);
        $("#qtyOnHand").val(item.qty);
    }
    updateQty();
    $("#btnAddToCart").attr("disabled", false);
});

/*add to cart*/
$("#btnAddToCart").click(function () {
    let QTYOnHand = parseInt($('#qtyOnHand').val());
    let orderQTY = parseInt($('#buyQty').val());
    if ($("#buyQty").val() != "") {
        if (QTYOnHand < orderQTY) {
            alert("There is no item Avilable for this Quntity...!")
        } else {
            updateQty();
            addToCart();
            loadAllCartDetails();
            clearInputQuntity();
        }
    } else {
        alert("Plese enter your Order Quntity...!");
    }
    getAmount();
});

subTotalArray = [];

function addToCart() {
    let iCode = $("#inputItemCode").val();
    let iName = $("#itemName").val();
    let iPrice = $("#itemPrice").val();
    let buyqty = $('#buyQty').val();
    let total = iPrice * buyqty;

    subTotalArray.push(total);

    /* var CartObject = {
         iCode: iCode,
         iName: iName,
         iPrice: iPrice,
         buyqty: buyqty,
         total: total
     }*/

    let CartObject = new CartDTO(iCode, iName, iPrice, buyqty, total);

    Cart.push(CartObject);
}

/*total*/
function getAmount() {
    var amount = 0;
    for (var i = 0; i < subTotalArray.length; i++) {
        amount += subTotalArray[i];
    }
    $("#txtTotal").text(amount + ".00");
}

/*discount*/
$("#txtDiscount").on('keydown', function (event) {
    if (event.key == 'Enter') {
        var discount = $("#txtDiscount").val();
        var tot = $("#txtTotal").text();
        var genarateDis = tot * discount / 100;

        var subValue = tot - genarateDis;
        $("#txtSubTotal").text(subValue + ".00");
    }
});

/*balance*/
$("#txtCash").on('keydown', function (event) {
    if (event.key == 'Enter') {
        var subTotal = $("#txtSubTotal").text();
        var cash = $("#txtCash").val();
        var balance = cash - subTotal;

        $("#txtBalance").val(balance + ".00");
        $("#btnPlaceOrder").attr('disabled', false);
    }
});

/*update quntity*/
function updateQty() {
    let qtyOnHand = $("#qtyOnHand").val();
    let orderqty = $('#buyQty').val();
    let newQTY = qtyOnHand - orderqty;

    for (let item of Items) {
        if ($("#inputItemCode").val() === item.code) {
            item.qty = newQTY;
            $("#qtyOnHand").val(item.qty);

            loadAllCartDetails();
        }
    }
}

/*load all*/
function loadAllCartDetails() {
    $("#orderTable").empty();
    for (let cartData of Cart) {

        var row = `<tr><td>${cartData.iCode}</td><td>${cartData.iName}</td><td>${cartData.iPrice}</td>
                                  <td>${cartData.buyqty}</td><td>${cartData.total}</td></tr>`;

        $("#orderTable").append(row);
    }
    CartItemRemove();
}

/*clear all text fields*/
function clearTextFields() {
    $("#orderId,#orderDate").val("");
    $("#inputCustomerID,#customerName,#customerAddress,#customerSalary").val("");
    $("#inputItemCode,#itemName,#itemPrice,#qtyOnHand,#buyQty").val("");
    $("#txtCash,#txtDiscount,#txtBalance").val("");
    $("#txtTotal,#txtSubTotal").text("");
    $("#orderTable").empty();
    $("#btnAddToCart").attr('disabled', true);
    $("#btnPlaceOrder").attr('disabled', true);
}

/*clear item text(quntity) fields*/
function clearInputQuntity() {
    $("#buyQty").val("");
}

/*remove item in table*/
function CartItemRemove() {
    $("#orderTable>tr").on('dblclick', function () {
        $(this).remove();
    });
}

/*place order*/
$("#btnPlaceOrder").click(function () {
    let oID = genarateAutoID();/*$("#orderId").val();*/
    let oDate = $("#orderDate").val();
    let cusID = $("#inputCustomerID").val();
    let dis = $("#txtDiscount").val();
    let total = $("#txtTotal").text();

    /*var orderObject = {
        oID: oID,
        oDate: oDate,
        cusID: cusID,
        dis: dis,
        total: total
    }*/

    let orderObject = new OrderDTO(oID, oDate, cusID, dis, total);

    Order.push(orderObject);

    alert("Order Saved Successfully...!");
    clearTextFields();
});

/*all details*/
$("#allOrder").click(function () {
    $("#tblAllOrders").empty();

    for (var orderDetails of Order) {
        var row = `<tr><td>${orderDetails.oID}</td><td>${orderDetails.oDate}</td>
                    <td>${orderDetails.cusID}</td><td>${orderDetails.dis}</td><td>${orderDetails.total}</td></tr>`;

        $("#tblAllOrders").append(row);
    }
});

/*search bar*/
$("#txtAllDetalsInput").on('keyup', function () {
    var value = $(this).val().toLowerCase();
    $("#tblAllOrders>tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


function genarateAutoID() {
    var x = 0;
    var oId = 'OID-00';

    if (Order.length == 0) {
        x = x + 1;
        return oId + x;
    } else {
        var detail = Order[Order.length - 1];

        var id = detail.oId;
        var y = id.substr(5,);
        var intZ = parseInt(y);
        intZ = intZ + 1;
        var newID = 'OID-00' + intZ;
        return newID;
    }
}