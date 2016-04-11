<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: X-Requested-With');
//require('crypter.php');
$fields_string = "";
$url = $_GET['url'];

//url-ify the data for the POST
/*$arr = ($_POST) ? $_POST : array();

foreach($_POST as $key=>$value) { 
	$fields_string .= $key.'='.$value.'&'; 
}
rtrim($fields_string, '&');*/

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url); 

//$crypt = new Crypter();
//$crypt->encryptString($_POST);
/*$fields_string = "";
foreach($_POST as $key=>$value) { 
	$fields_string .= $key.'='.$value.'&'; 
}
echo $fields_string;*/
//print_r($_SERVER['REQUEST_METHOD']);

if ( strtolower($_SERVER['REQUEST_METHOD']) == 'post' ) {

	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

if ( strtolower($_SERVER['REQUEST_METHOD']) == 'delete' ) {   
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/json"));
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    $result = curl_exec($ch);
    echo $result; exit;
}

if ( strtolower($_SERVER['REQUEST_METHOD']) == 'put' ) {   

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input')); 
    $result = curl_exec($ch);
    echo $result; exit;

}

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);
//$result = $crypt->decryptString($result);
return json_encode( $result );

?>