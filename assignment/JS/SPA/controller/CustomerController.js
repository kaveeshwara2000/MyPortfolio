/*Save*/
$("#btnSaveCustomer").click(function () {
    saveCustomer();
});

function saveCustomer(){
    let customerID = $("#txtCustomerID").val();
    let customerName = $("#txtCustomerName").val();
    let customerAddress = $("#txtCustomerAddress").val();
    let customerSalary = $("#txtCustomerSalary").val();

    /*var CustomerObject = {
        id: customerID,
        name: customerName,
        address: customerAddress,
        salary: customerSalary
    }*/

    let CustomerObject = new CustomerDTO(customerID, customerName, customerAddress, customerSalary);

    Customers.push(CustomerObject);

    loadAllCustomers();
    alert("Customer Saved Successfully...!");
    clearAllTexts();
    bindRowClickEvents();
    loadAllCustomersForOption();
}

/*Update*/
$("#btnUpdateCustomer").click(function () {
    let customerID = $("#txtCustomerID").val();
    let response = updateCustomer(customerID);
    if (response) {
        alert("Customer Updated Successfully...!");
        clearAllTexts();
    } else {
        alert("Update Failed..!");
    }
});

/*delete*/
$("#btnDeleteCustomer").click(function () {
    let deleteID = $("#txtCustomerID").val();

    let option = confirm("Do you really want to delete customer id :" + deleteID);
    if (option) {
        if (deleteCustomer(deleteID)) {
            alert("Customer Successfully Deleted..");
            clearAllTexts();
        } else {
            alert("There is no such customer to delete. please check the id.");
        }
    }
    loadAllCustomers();
});

function loadAllCustomers() {
    $("#tblCustomer").empty();

    for (var customer of Customers) {

        var row = `<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`;

        $("#tblCustomer").append(row);
    }
    bindRowClickEvents();
}

/*select data in table*/
function bindRowClickEvents() {

    $("#tblCustomer>tr").click(function () {
        let id = $(this).children(":eq(0)").text();
        let name = $(this).children(":eq(1)").text();
        let address = $(this).children(":eq(2)").text();
        let salary = $(this).children(":eq(3)").text();

        /*
                console.log(id, name, address, salary);
        */

        /*set table details to text field*/
        $('#txtCustomerID').val(id);
        $('#txtCustomerName').val(name);
        $('#txtCustomerAddress').val(address);
        $('#txtCustomerSalary').val(salary);
    });
}

$("#txtCustomerID").on('keyup', function (event) {
    if (event.code == "Enter") {
        let typedId = $("#txtCustomerID").val();
        let customer = searchCustomer(typedId);
        if (customer != null) {
            setTextfieldValues(customer.id, customer.name, customer.address, customer.salary);
        } else {
            alert("There is no cusotmer available for that " + typedId);
            $('#txtCustomerName').val("");
            $('#txtCustomerAddress').val("");
            $('#txtCustomerSalary').val("");
        }
    }
});

function setTextfieldValues(id, name, address, salary) {
    $("#txtCustomerID").val(id);
    $("#txtCustomerName").val(name);
    $("#txtCustomerAddress").val(address);
    $("#txtCustomerSalary").val(salary);
}

function searchCustomer(cusID) {
    for (let Customer of Customers) {
        if (Customer.id == cusID) {
            return Customer;
        }
    }
    return null;
}

function updateCustomer(customerID) {
    let customer = searchCustomer(customerID);
    if (customer != null) {
        customer.id = $("#txtCustomerID").val();
        customer.name = $("#txtCustomerName").val();
        customer.address = $("#txtCustomerAddress").val();
        customer.salary = $("#txtCustomerSalary").val();
        loadAllCustomers();
        return true;
    } else {
        return false;
    }
}

function deleteCustomer(customerID) {
    let customer = searchCustomer(customerID);
    if (customer != null) {
        let indexNumber = Customers.indexOf(customer);
        Customers.splice(indexNumber, 1);
        loadAllCustomers();
        return true;
    } else {
        return false;
    }
}

/*search bar*/
$('#txtInput').on('keyup', function () {
    var value = $(this).val().toLowerCase();
    $('#tblCustomer>tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


//////////////////////////////////////////////////////////////////////////////////////
/*validation*/

$("#txtCustomerID").focus();

// customer reguler expressions
const cusIDRegEx = /^(C00-)[0-9]{1,3}$/;
const cusNameRegEx = /^[A-z ]{5,20}$/;
const cusAddressRegEx = /^[0-9/A-z. ,]{7,}$/;
const cusSalaryRegEx = /^[0-9]{1,}[.]?[0-9]{1,2}$/;

let customerValidations = [];
customerValidations.push({
    reg: cusIDRegEx,
    field: $('#txtCustomerID'),
    error: 'Customer ID Pattern is Wrong : C00-001'
});
customerValidations.push({
    reg: cusNameRegEx,
    field: $('#txtCustomerName'),
    error: 'Customer Name Pattern is Wrong : A-z 5-20'
});
customerValidations.push({
    reg: cusAddressRegEx,
    field: $('#txtCustomerAddress'),
    error: 'Customer Address Pattern is Wrong : A-z 0-9 ,/'
});
customerValidations.push({
    reg: cusSalaryRegEx,
    field: $('#txtCustomerSalary'),
    error: 'Customer Salary Pattern is Wrong : 100 or 100.00'
});


//disable tab key of all four text fields using grouping selector in CSS
$("#txtCustomerID,#txtCustomerName,#txtCustomerAddress,#txtCustomerSalary").on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});


$("#txtCustomerID,#txtCustomerName,#txtCustomerAddress,#txtCustomerSalary").on('keyup', function (event) {
    checkValidity();
});

$("#txtCustomerID,#txtCustomerName,#txtCustomerAddress,#txtCustomerSalary").on('blur', function (event) {
    checkValidity();
});


$("#txtCustomerID").on('keydown', function (event) {
    if (event.key == "Enter" && check(cusIDRegEx, $("#txtCustomerID"))) {
        $("#txtCustomerName").focus();
    } else {
        focusText($("#txtCustomerID"));
    }
});


$("#txtCustomerName").on('keydown', function (event) {
    if (event.key == "Enter" && check(cusNameRegEx, $("#txtCustomerName"))) {
        focusText($("#txtCustomerAddress"));
    }
});


$("#txtCustomerAddress").on('keydown', function (event) {
    if (event.key == "Enter" && check(cusAddressRegEx, $("#txtCustomerAddress"))) {
        focusText($("#txtCustomerSalary"));
    }
});


$("#txtCustomerSalary").on('keydown', function (event) {
    if (event.key == "Enter" && check(cusSalaryRegEx, $("#txtCustomerSalary"))) {
        let res = confirm("Do you want to add this Customer..?");
        if (res) {
            saveCustomer();
        }
    }
});


function checkValidity() {
    let errorCount = 0;
    for (let validation of customerValidations) {
        if (check(validation.reg, validation.field)) {
            textSuccess(validation.field, "");
        } else {
            errorCount = errorCount + 1;
            setTextError(validation.field, validation.error);
        }
    }
    setButtonState(errorCount);
}

function check(regex, txtField) {
    let inputValue = txtField.val();
    return regex.test(inputValue) ? true : false;
}

function setTextError(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField, "");
    } else {
        txtField.css('border', '2px solid red');
        txtField.parent().children('span').text(error);
    }
}

function textSuccess(txtField, error) {
    if (txtField.val().length <= 0) {
        defaultText(txtField, "");
    } else {
        txtField.css('border', '2px solid green');
        txtField.parent().children('span').text(error);
    }
}

function defaultText(txtField, error) {
    txtField.css("border", "1px solid #ced4da");
    txtField.parent().children('span').text(error);
}

function focusText(txtField) {
    txtField.focus();
}

function setButtonState(value) {
    if (value > 0) {
        $("#btnSaveCustomer").attr('disabled', true);
    } else {
        $("#btnSaveCustomer").attr('disabled', false);
    }
}

function clearAllTexts() {
    $("#txtCustomerID").focus();
    $("#txtCustomerID,#txtCustomerName,#txtCustomerAddress,#txtCustomerSalary").val("");
    checkValidity();
}



