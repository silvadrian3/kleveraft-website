<html>
    <head>
        <title>Barcodes</title>
        <script type="text/javascript">
            function printTransactions() {
                
                var divToPrint=document.getElementById("divPrint");
                //newWin= window.open("");
                //newWin.document.write("<style type='text/css' media='print'>@page port {size: portrait;}@page land {size: landscape;}.portrait {page: port;}.landscape {page: land;}</style>");
                //newWin.document.write(divToPrint.outerHTML);
                window.print();
                window.close();

            }
        </script>
    </head>
    <body onload="printTransactions()">
        <div id="divPrint">
            <?php

                if(isset($_GET['m']) && !empty($_GET['m'])){
                    $k = '0100101001100101011100110111010101110011';
                    $cof = md5($k);
                    $fee = $_GET['m'];

                    if($cof == $fee) {
                        include "con.php";
                        if(!empty($_GET['p'])){
                            foreach($_GET['p'] as $product_id){

                                $query = mysqli_query($nect, "SELECT code FROM `products` WHERE id='". $product_id ."'");

                                if($query){
                                    if(mysqli_num_rows($query)!=0){
                                        $fetch = mysqli_fetch_array($query);
                                        echo '<img alt="testing" src="barcode.php?codetype=Code128&text='.$fetch['code'].'&print=true" />';
                                    }
                                }

                            }
                        }
                    }
                }

            ?>
        </div>
        
    </body>
</html>

            
