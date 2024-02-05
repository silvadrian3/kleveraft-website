app.controller('partnersCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', function ($scope, $http, $cookies, $cookieStore, $filter) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el).success(function (response) {
            if (response[0].result) {
                $scope.partners = response[0].data;
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
    
    /**
    $('#chkAll').click(function(event) {   
        if(this.checked){
            $('.check_item').each(function() {
                this.checked = true;
            });
        } else {
                $('.check_item').each(function() {
                    this.checked = false;
                });
            }
    });
    
    $scope.checkCB = function (evt) {
        if(this.checked == false){
            $("#chkAll")[0].checked = false;
        }
        
        if ($('.check_item:checked').length == $('.check_item').length ){ 
            $("#chkAll")[0].checked = true;  
        } else {
            $("#chkAll")[0].checked = false;
        }
    };
    */

    $scope.single_action = function (cat, id) {
        if (cat === 'r') { //read
            window.location = "#/partner/view/" + id;
        } else if (cat === 'u') { //update
            window.location = "#/partner/edit/" + id;
        } else if (cat === 'd') { //delete
            if (confirm("Are you sure you want to delete this Partner?")) {
                
                $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + id + "&action=remove").success(function (response) {
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Partners',
                            activity: 'Archive',
                            verb: 'Archived a Partner'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                            if (response[0].result) {
                                $scope.clientresponse("Partner successfully deleted.", 1);

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
                
            }
        } else if (cat === 'a') { //delete
            if (confirm("Are you sure you want to approve this Partner?")) {
                
                $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + id + "&action=approve").success(function (response) {
                    var params = {
                        client_id: id,
                        template: 'approvepartner'
                    };
                    
                    $http.post(baselocation + "/api/ctrl/emailtemplates.php?m=" + el, params).success(function (response) {
                        if (response[0].result) {
                            var body = response[0].data[0].body,
                                recipient = response[0].data[0].recipient,
                                params = {
                                    from: 'support@mybmapp.net',
                                    fromname: 'BMapp Support Team',
                                    subject: 'Welcome to ',
                                    body: body,
                                    address: recipient
                                };

                            $http.post(baselocation + "/api/v1/sender.php?m=" + el, params).success(function (response) {
                                if (response[0].result) {
                                    var params = {
                                        user_id: ui,
                                        client_id: ci,
                                        module: 'Partners',
                                        activity: 'Approved',
                                        verb: 'Approved a Partner'
                                    };

                                    $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                                        if (response[0].result) {
                                            $scope.clientresponse("Partner successfully approved.", 1);

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

                        } else {
                            $scope.clientresponse("Unexpected error encountered.", 0);
                        }
                    }).error(function (msg) {
                        $scope.onError(msg);
                    });
                    
                }).error(function (msg) {
                    $scope.onError(msg);
                });
                
                
            }
        }
    };
    
    /**
    $scope.multidelete = function () {
        var arr_partner_id = [];
        angular.forEach($scope.partners, function (item) {
            if (item.partner) {
                arr_partner_id.push(item.partner_id);
            }
        });
        
        if (confirm("Are you sure you want to delete selected Partner(s)?")) {
            var u_id = $cookieStore.get('user_id'),
                c_id = $cookieStore.get('client_id'),
                bit = true,
                params = {
                    user_id: u_id,
                    partner_ids: arr_partner_id
                };
            
            $http.post("http://localhost/flair/app/api/v1/partners/multiple", params).success(function (response) {
                if (response.result) {
                    var ui = u_id,
                        params = {
                            user_id: ui,
                            activity: "Delete Multiple Partners"
                        };

                    $http.post("http://localhost/flair/app/api/v1/activity", params).success(function (response) {
                        if (response.result) {
                            bit = true;
                        } else {
                            bit = false;
                        }
                    });

                } else {
                    bit = false;
                }

            }).error(function (msg){
                console.log(msg);
            });
                
            if (bit) {
                $scope.result_msg = "Partner(s) successfully deleted.";
                $scope.success = true;
                $scope.failed = false;

                setTimeout(function () {
                    location.reload();
                }, 3000);
            } else {
                $scope.result_msg = "Unexpected error encountered.";
                $scope.failed = true;
                $scope.success = false;
            }
                
            $scope.display_result = true;
        }
    };
    */
    
    /**
    $scope.multiupdate = function () {
        var arr_partner_id = "id=";
        angular.forEach($scope.partners, function (item) {
            if (item.partner) {
                arr_partner_id = arr_partner_id + item.partner_id + '-';
                //arr_partner_id.push(item.partner_id);
            }
        });
        
        arr_partner_id = arr_partner_id.slice(0, -1);
        window.location = "#/partner/update/?" + arr_partner_id;
    };
    */
    
    
}]);

//Add
app.controller('addPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type');
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    $scope.checkPartnerExst = function () {
        
        if ($scope.name !== "" && $scope.name !== undefined) {
            var params = {
                    module: 'partner',
                    variable: $scope.name
                };

            $http.post(baselocation + "/api/v1/check_exist.php?m=" + el, params).success(function (response) {
                if (response[0].result) {

                    if (response[0].data[0].row !== 0) {
                        alert('Partner Name already exists.');
                        $scope.name = "";
                        angular.element('#name').focus();
                    }

                } else {
                    $scope.clientresponse("Unexpected error encountered.", 0);
                }

            }).error(function (msg) {
                $scope.onError(msg);
            });
        }
        
    };
    
    $scope.addPartner = function () {
        angular.element('#btn_save').css("pointer-events", "none");
        var userparams = {
                firstname: $scope.representative_firstname,
                lastname: $scope.representative_lastname,
                username: $scope.email,
                password: $scope.password,
                type: 'client'
            };
        
        $http.post(baselocation + "/api/v1/users.php?m=" + el + "&ui=" + ui, userparams).success(function (response) {
            if (response[0].result) {
                var user_id = response[0].data[0].id,
                    partnerparams = {
                        user_id: user_id,
                        name: $scope.name,
                        phone: $scope.phone,
                        mobile: $scope.mobile,
                        email: $scope.email,
                        address: $scope.address,
                        facebook: $scope.facebook,
                        instagram: $scope.instagram,
                        twitter: $scope.twitter
                    };
                
                $http.post(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui, partnerparams).success(function (response) {
                    if (response[0].result) {
                        
                        var client_id = response[0].data[0].id,
                            clientuserparams = {
                                client_id: client_id,
                                user_id: user_id
                            };
                        
                        $http.post(baselocation + "/api/v1/client_users.php?m=" + el + "&ui=" + ui, clientuserparams).success(function (response) {
                            if (response[0].result) {
                                
                                var params = {
                                    user_id: user_id,
                                    template: 'addpartner',
                                    username: $scope.email,
                                    password: $scope.password
                                };

                                $http.post(baselocation + "/api/ctrl/emailtemplates.php?m=" + el, params).success(function (response) {
                                    if (response[0].result) {
                                        var body = response[0].data[0].body,
                                            recipient = response[0].data[0].recipient,
                                            params = {
                                                from: 'sales@kleveraft.com',
                                                fromname: 'KleveRaft',
                                                subject: 'Welcome to KleveRaft\'s Inventory System',
                                                body: body,
                                                address: recipient
                                            };
                                        $http.post(baselocation + "/api/v1/sender.php?m=" + el, params).success(function (response) {
                                            if (response[0].result) {
                                                var params = {
                                                    user_id: ui,
                                                    client_id: ci,
                                                    module: 'Partners',
                                                    activity: 'Add',
                                                    verb: 'Added a Partner'
                                                };

                                                $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                                                    if (response[0].result) {
                                                        $scope.clientresponse("Partner successfully added.", 1);
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
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
     
    setTimeout(function () {
        loadpage();
    }, 500);
    
}]);

//View
app.controller('viewPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {
    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        v_id = $routeParams.id,
        na = 'N/A';
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + v_id).success(function (response) {
            if (response[0].result) {
                
                if (response[0].data[0].name !== "") {
                    $scope.name = response[0].data[0].name;
                } else {
                    $scope.name = na;
                }

                if (response[0].data[0].representative_firstname !== "") {
                    $scope.representative_firstname = response[0].data[0].representative_firstname;
                } else {
                    $scope.representative_firstname = na;
                }

                if (response[0].data[0].representative_lastname !== "") {
                    $scope.representative_lastname = response[0].data[0].representative_lastname;
                } else {
                    $scope.representative_lastname = na;
                }

                if (response[0].data[0].email !== "") {
                    $scope.email = response[0].data[0].email;
                } else {
                    $scope.email = na;
                }

                if (response[0].data[0].phone_no !== "") {
                    $scope.phone = response[0].data[0].phone_no;
                } else {
                    $scope.phone = na;
                }

                if (response[0].data[0].mobile_no !== "") {
                    $scope.mobile = response[0].data[0].mobile_no;
                } else {
                    $scope.mobile = na;
                }

                if (response[0].data[0].address !== "") {
                    $scope.address = response[0].data[0].address;
                } else {
                    $scope.address = na;
                }
                
                if (response[0].data[0].facebook !== "") {
                    $scope.facebook = response[0].data[0].facebook;
                } else {
                    $scope.facebook = na;
                }
                
                if (response[0].data[0].instagram !== "") {
                    $scope.instagram = response[0].data[0].instagram;
                } else {
                    $scope.instagram = na;
                }
                
                if (response[0].data[0].twitter !== "") {
                    $scope.twitter = response[0].data[0].twitter;
                } else {
                    $scope.twitter = na;
                }

            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
    });
    
    $scope.gotoUpdate = function () {
        window.location = "#/partner/edit/" + v_id;
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
    
    setTimeout(function () {
        loadpage();
    }, 500);
    
    
}]);

//Edit
app.controller('editPartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var el = '5fea10f9b07309ead88909855cfff695',
        ui = $cookieStore.get('user_id'),
        ci = $cookieStore.get('client_id'),
        type = $cookieStore.get('user_type'),
        v_id = $routeParams.id;
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
        
        $http.get(baselocation + "/api/v1/clients.php?m=" + el + "&client_id=" + v_id).success(function (response) {
            if (response[0].result) {
                $scope.user_id = response[0].data[0].user_id;
                $scope.name = response[0].data[0].name;
                //$scope.representative_id = response[0].data[0].representative_id;
                $scope.representative_firstname = response[0].data[0].representative_firstname;
                $scope.representative_lastname = response[0].data[0].representative_lastname;
                $scope.email = response[0].data[0].email;
                $scope.phone = response[0].data[0].phone_no;
                $scope.mobile = response[0].data[0].mobile_no;
                $scope.address = response[0].data[0].address;
                $scope.facebook = response[0].data[0].facebook;
                $scope.instagram = response[0].data[0].instagram;
                $scope.twitter = response[0].data[0].twitter;
            }
        }).error(function (msg) {
            $scope.onError(msg);
        });
        
        setTimeout(function () {
            loadpage();
        }, 500);
        
    });
      
    $scope.updatePartner = function () {
        var params = {
                user_id: $scope.user_id,
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                mobile: $scope.mobile,
                address: $scope.address,
                facebook: $scope.facebook,
                instagram: $scope.instagram,
                twitter: $scope.twitter,
                type: 'client'
            };
            
        $http.put(baselocation + "/api/v1/clients.php?m=" + el + "&ui=" + ui + "&client_id=" + v_id + "&action=profile", params).success(function (response) {
            if (response[0].result) {
                var params = {
                    user_id: $scope.user_id,
                    firstname: $scope.representative_firstname,
                    lastname: $scope.representative_lastname
                };

                $http.put(baselocation + "/api/v1/users.php?m=" + el + "&ui=" + ui, params).success(function (response) {
                    if (response[0].result) {
                        var params = {
                            user_id: ui,
                            client_id: ci,
                            module: 'Partners',
                            activity: 'Update',
                            verb: 'Updated a Partner Details'
                        };

                        $http.post(baselocation + "/api/v1/activity.php?m=" + el, params).success(function (response) {
                            if (response[0].result) {
                                $scope.clientresponse("Partner details successfully updated.", 1);
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

            } else {
                $scope.clientresponse("Unexpected error encountered.", 0);
            }

        }).error(function (msg) {
            $scope.onError(msg);
        });
        
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
    
}]);

/**
app.controller('editMultiplePartnerCtrl', ['$scope', '$http', '$cookies', '$cookieStore', '$filter', '$routeParams', function ($scope, $http, $cookies, $cookieStore, $filter, $routeParams) {

    "use strict";
    prepage();
    
    var u_id = $cookieStore.get('user_id'),
        c_id = $cookieStore.get('client_id'),
        v_id = $routeParams.id,
        arr_id = "";
    
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    angular.element(document).ready(function () {
    
        $http.get("http://localhost/flair/app/api/v1/partners/" + c_id + "/multi/" + v_id).success(function (response) {
            if (response.result) {
                $scope.listpartners = response.data;
            }
        }).error(function (msg){
            console.log(msg);
        });
    
        setTimeout(function () {
            loadpage();
        }, 500);
        
    });
    
    $scope.updateMultiplePartner = function () {
        var bit = true,
            params = [];
        
        angular.forEach($scope.listpartners, function (item) {
            var contact_id = item.contact_id,
                name = angular.element("#name_" + contact_id).val(),
                address = angular.element("#address_" + contact_id).val(),
                email = angular.element("#email_" + contact_id).val(),
                firstname = angular.element("#firstname_" + contact_id).val(),
                lastname = angular.element("#lastname_" + contact_id).val(),
                phone = angular.element("#phone_" + contact_id).val(),
                mobile = angular.element("#mobile_" + contact_id).val(),
            
                paramloop = {
                    contact_id: contact_id,
                    name: name,
                    firstname: firstname,
                    lastname: lastname,
                    address: address,
                    email: email,
                    phone: phone,
                    mobile: mobile,
                    type: 3
                };
            
            params.push(paramloop);
        });
        
        $http.put("http://localhost/flair/app/api/v1/contacts/multi", params).success(function (response) {
            if (response.result) {
                var ui = u_id,
                    params = {
                        user_id: ui,
                        activity: "Update Multiple Partner Details"
                    };

                $http.post("http://localhost/flair/app/api/v1/activity", params).success(function (response) {
                    if (response.result) {
                        bit = true;
                    } else {
                        bit = false;
                    }
                });
                

            } else {
                bit = false;
            }
            
        }).error(function (msg){
            console.log(msg);
        });
        
        if (bit) {
            $scope.result_msg = "Partner details successfully updated.";
            $scope.success = true;
            $scope.failed = false;

            setTimeout(function () {
                location.reload();
            }, 3000);
        } else {
            $scope.result_msg = "Unexpected error encountered.";
            $scope.failed = true;
            $scope.success = false;
        }
        
        $scope.display_result = true;
        
    };
    
    $scope.gotoList = function () {
        window.location = "#partners";
    };
    
}]);
*/

//Import
/**
app.controller('importPartnerCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    "use strict";
    prepage();
    
    //console.log($routeParams.id);
    angular.element('.nav-li').removeClass('active');
    angular.element('#nav-li-partners').addClass('active');
    //angular.element('.navbar-toggle').click();
    
    setTimeout(function () {    
            $('#page-wrapper').show();
            loadpage();
    }, 500);
    
    $scope.start_import = function () {
        $("#tbl_records_importpartner").dataTable().fnDestroy();
        $scope.imported_partners = mprt_out;
        //console.log(mprt_out);
        
        setTimeout(function () {
            $('#tbl_records_importpartner').dataTable({
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            });
            
            $("#div_importpartner").show();
        }, 500);
        
        //console.log(mprt_out);
    }

}]);
*/