<?php

$conn = new mysqli("localhost","root","","dari_kebun");

$sql = "SELECT *FROM cart";

$result = $conn -> query($sql);





$data=[];
while($row = $result->fetch_assoc()){
  $data[]=$row;
}

echo json_encode($data)

?>