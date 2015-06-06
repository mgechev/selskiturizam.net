<?php
if (!empty($_POST['email']) && !empty($_POST['content']) &&
	filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
	$to[0] = 'mariela_gencheva@abv.bg';
	$to[1] = 'mgechev@gmail.com';
	$content = $_POST['content'];
	$email = $_POST['email'];
	$headers = 'From: ' . $email . "\r\n" .
				'Replay-To: ' . $email . "\r\n";
	if (empty($_POST['subject'])) {
		$subject = 'Балабановата къща';
	} else {
		$subject = $_POST['subject'];
	}
	mail($to[0], $subject, $content, $headers, '-f' . $email);
	mail($to[1], $subject, $content, $headers, '-f' . $email);
	echo('{ "success": "Вашето съобщение е изпратено!" }');
} else {
	echo('{ "error": "Некоректни данни!" }');
}
?>
