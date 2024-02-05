<html>
    <head>
        <title>Barcodes</title>
        <script type="text/javascript">
            function printTransactions() {
                
                var divToPrint=document.getElementById("divPrint");
                
                
                window.print();
                //document.getElementById("divPrint").style.display = 'none';
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

                                $query = mysqli_query($nect, "SELECT code, price FROM `products` WHERE id='". $product_id ."'");

                                if($query){
                                    if(mysqli_num_rows($query)!=0){
                                        $fetch = mysqli_fetch_array($query);
                                        echo "<div style='border:solid 0.5px #bbb; text-align:center; padding:0.5%; display:inline-table'>";
                                        echo "P " . $fetch['price'];
                                        echo '<br/><img alt="testing" src="barcode.php?codetype=Code128&text='.$fetch['code'].'&print=false" style="margin:2px" /><br/>';
                                        echo $fetch['code'];
                                        echo "</div>";
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

            
