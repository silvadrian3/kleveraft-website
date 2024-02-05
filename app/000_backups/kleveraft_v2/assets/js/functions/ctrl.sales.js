app.controller('salesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        removedcats = [];

    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-sales').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/sales.php?m=" + el + isClient).success(function (response) {
            console.log(response);
            if (response[0].result) {
                $scope.sales = response[0].data;
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "aoColumnDefs" : [{'bSortable' : false, 'aTargets' : [-1]}]
            });
            
            $('#page-wrapper').show();
            loadpage();
            
        }, 500);
    });
    
    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/sales/view/" + id;
        }
    };
    
}]);


app.controller('viewSalesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        v_id = $routeParams.id,
        na = 'N/A';
    
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
            
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-sales').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {

        $http.get(baselocation + "/api/v1/sales.php?m=" + el + isClient + "&id=" + v_id).success(function (response) {
            console.log(response);
            if (response[0].result) {
                if (response[0].data[0].sales_id !== "") {
                    $scope.sales_id = response[0].data[0].sales_id;
                } else {
                    $scope.sales_id = "";
                }

                if (response[0].data[0].total_qty !== "") {
                    $scope.total_quantity = response[0].data[0].total_quantity;
                } else {
                    $scope.total_quantity = 0;
                }

                if (response[0].data[0].total_amount !== "") {
                    $scope.total_amount = response[0].data[0].total_amount;
                } else {
                    $scope.total_amount = 0.00;
                }

                if (response[0].data[0].transaction_date !== "" && response[0].data[0].transaction_date !== "0000-00-00") {
                    $scope.transaction_date = response[0].data[0].transaction_date;
                } else {
                    $scope.transaction_date = "";
                }

                if (response[0].data[0].comment !== "") {
                    $scope.comment = response[0].data[0].comment;
                } else {
                    $scope.comment = na;
                }
                
                if (response[0].data[0].breakdown.length !== 0) {
                    $scope.sales_breakdown = response[0].data[0].breakdown;
                }
            }
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.gotoList = function () {
        window.location = "#sales";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);

app.controller('addSalesCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        arr_product_id = [],
        arr_product_code = [],
        x;
    
    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-sales').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $scope.delivery_items = [{}, {}, {}, {}, {}];
        
        $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient).success(function (response) {
            console.log(response);
            if (response[0].result) {

                for (x = 0; x < response[0].data.length; x++) {
                    arr_product_id.push(response[0].data[x].product_id);
                    arr_product_code.push(response[0].data[x].code);
                }

                $scope.productcodes = arr_product_code;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
    });
    
    $scope.addRow = function () {
        $scope.delivery_items.push({});
    };
    
    $scope.removeRow = function (evt) {
        
        var row_id = evt.target.id;
        
		$scope.delivery_items.splice(row_id, 1);
        
        setTimeout(function () {
            compute_grandtotal();
        }, 0);
        
	};
    
    $scope.populate_data = function (x) {
        
        var productcode = angular.element("#code_" + x).val(),
            i;
        
        if (productcode !== undefined && productcode !== "") {
            for (i = 0; i < arr_product_code.length; i++) {
                if (productcode.trim() === arr_product_code[i].trim()) {
                    $scope.product_id = arr_product_id[i];
                    break;
                }
            }

            if (i === arr_product_code.length) {
                $scope.product_id = 0; // does not exists
            }
            
            if ($scope.product_id !== 0) {
                
                $http.get(baselocation + "/api/v1/products.php?m=" + el + isClient + "&id=" + $scope.product_id).success(function (response) {
                    console.log(response);
                    if (response[0].result) {
                        angular.element("#product_service_" + x).val(response[0].data[0].name);
                        angular.element("#price_" + x).val(response[0].data[0].price);
                        angular.element("#quantity_" + x).select();
                        compute_linetotal(x);
                    }
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
            } else {
                console.log("Product Code not registered.");
            }
        }
    };
   
    $scope.saveSales = function () {
        angular.element('#btn_save').css("pointer-events", "none");
        var transaction_arr = [];

        $('.tr_records').each(function () {
                
            var each_id = this.id.substr(this.id.lastIndexOf("_") + 1).trim(),
                product_id = 0,
                name = angular.element("#product_service_" + each_id).val().trim(),
                code = angular.element("#code_" + each_id).val().trim(),
                price = parseFloat(moneytrim(angular.element("#price_" + each_id).val().trim())),
                qty = angular.element("#quantity_" + each_id).val().trim(),
                amount = parseFloat(moneytrim(angular.element("#amount_" + each_id).val().trim())),
                i;
                
            if (code !== undefined && code !== "") {
                for (i = 0; i < arr_product_code.length; i++) {
                    if (code.trim() === arr_product_code[i].trim()) {
                        product_id = arr_product_id[i];
                        break;
                    }
                }
                    
                transaction_arr.push({
                    product_id: product_id,
                    price: price,
                    qty: qty,
                    amount: amount
                });
            }
        });
        
        var params = {
                total_qty: angular.element("#totalqty").text(),
                total_amt: parseFloat(moneytrim(angular.element("#grandtotal").text().replace("P ", ''))),
                comment: $scope.comment,
                transaction_arr: transaction_arr
            };

        
        $http.post(baselocation + "/api/v1/sales.php?m=" + el + "&ui=" + ui + isClient, params).success(function (response) {
console.log(response);
            if (response[0].result) {
                var params = {
                    user_id: ui,
                    client_id: ci,
                    module: 'Sales',
                    activity: 'Add',
                    verb: 'Added Sales Invoice'
                };

                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
console.log(response);
                    if (response[0].result) {
                        $scope.clientresponse("Sales invoice successfully added.", 1);

                        setTimeout(function () {
                            location.reload();
                        }, 3000);
                    } else {
                        $scope.clientresponse("Unexpected error encountered.", 0);
                    }
                }).error(function (msg) {
                    $scope.onError(msg);
                });
            } else {
                $scope.clientresponse("Unexpected error encountered.", 0);
            }
            

        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    };
    
}]);


app.controller('sales_reportsCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        isClient = '',
        arr_partner_id = [],
        arr_partner_name = [];

    if (type === "client") {
        isClient = "&client_id=" + ci;
    }
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-reports').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $scope.startdate = getdate();
        $scope.enddate = getdate();
        
        var sdate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(getdate()), "yyyy-MM-dd"),
            datefilter = "&startdate=" + sdate + "&enddate=" + edate,
            i;
        
        $http.get(baselocation + "/api/v1/sales.php?m=" + el + isClient + datefilter + "&report=1").success(function (response) {
console.log(response);
            var result_total_amount = 0.00,
                result_total_qty = 0,
                y;
            
            if (response[0].result) {
                $scope.transactions = response[0].data;
                
                for(y = 0; y < response[0].data.length; y++){
                    result_total_amount += parseFloat(response[0].data[y].amount);
                    result_total_qty += parseInt(response[0].data[y].quantity);
                }    
            }
            
            $scope.total_amount_result = parseFloat(result_total_amount);
            $scope.total_qty_result = parseInt(result_total_qty);
            
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el).success(function (response) {
console.log(response);
            if (response[0].result) {

                for (var x = 0; x < response[0].data.length; x++) {
                    arr_partner_id.push(response[0].data[x].client_id);
                    arr_partner_name.push(response[0].data[x].name);
                }

                $scope.partners = arr_partner_name;

            }
        }).error(function (msg){
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            $('#tbl_records').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                bPaginate: false,
                bInfo: false
            });
            
            $('#page-wrapper').show();
            loadpage();
            
        }, 500);    
    });
    
    $scope.search = function () {
        
        $scope.partner_id = "";
        if ($scope.partner !== undefined && $scope.partner !== "") {
            for (var i = 0; i < arr_partner_name.length; i++) {
                if ($scope.partner.trim() === arr_partner_name[i].trim()) {
                    $scope.partner_id = arr_partner_id[i];
                    break;
                }
            }

            if (i === arr_partner_name.length) {
                $scope.partner_id = "";
            }
        }
        
        var sdate = $filter('date')(new Date(angular.element("#startdate").val()), "yyyy-MM-dd"),
            edate = $filter('date')(new Date(angular.element("#enddate").val()), "yyyy-MM-dd"),
            datefilter = "&startdate=" + sdate + "&enddate=" + edate;
        
        if($scope.partner_id !== "" && $scope.partner_id !== undefined) {
            datefilter += "&partner_id=" + $scope.partner_id;
        }
        
        $http.get(baselocation + "/api/v1/sales.php?m=" + el + isClient + datefilter + "&report=1").success(function (response) {
console.log(response);
            var result_total_amount = 0.00,
                result_total_qty = 0,
                y;
            
            if (response[0].result) {
                angular.element(".btn_export").show();
                $("#tbl_records").dataTable().fnDestroy();
                
                prepage();
                $('#page-wrapper').hide();
                
                $scope.transactions = response[0].data;
                
                for(y = 0; y < response[0].data.length; y++){
                    result_total_amount += parseFloat(response[0].data[y].amount);
                    result_total_qty += parseInt(response[0].data[y].quantity);
                }
                
                setTimeout(function () {
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
                
            } else {
                prepage();
                $('#page-wrapper').hide();
                $scope.transactions = [];
                $("#tbl_records").dataTable().fnDestroy();
                
                setTimeout(function () {
                    //alert("No result found. Please try another filter.");
                    
                    $('#tbl_records').dataTable({
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                        bPaginate: false,
                        bInfo: false
                    });
                    
                    $('#page-wrapper').show();
                    loadpage();
                }, 500);
            }
            
            $scope.total_amount_result = parseFloat(result_total_amount);
            $scope.total_qty_result = parseInt(result_total_qty);
            
        }).error(function (msg){
            $scope.onError(msg);
        });
        
    }
    
}]);