<?php
$name       = @trim(stripslashes($_POST['name'])); 
$to       	= @trim(stripslashes($_POST['email'])); 
$subject    = @trim(stripslashes($_POST['subject'])); 
$message    = @trim(stripslashes($_POST['message'])); 
$navigator  = @trim(stripslashes($_POST['navigator'])); 
$from   	= 'yang@panorigin.com';

$headers   = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=ISO-8859-1";
$headers[] = "From: {$name} <{$from}>";
// $headers[] = "CC: info@panorigin.com";
$headers[] = "CC: tan.chen@720showme.com";
$headers[] = "Reply-To: <{$from}>";
$headers[] = "Subject: {$subject}";
$headers[] = "X-Mailer: PHP/".phpversion();

$headerString = implode('\r\n', $headers);
mail($to, $subject, $message, $headerString);
mail($from, $subject, $message.'\r\n\r\n'.$navigator, $headerString);
	
echo json_encode(array("result" => "your result"));
return 'done';
// die;