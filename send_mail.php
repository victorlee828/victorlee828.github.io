<?php
header("Content-Type: application/json; charset=utf-8");
date_default_timezone_set("Asia/Shanghai");

// 企业微信邮箱配置
$smtp_server   = 'smtp.exmail.qq.com';
$smtp_port     = 465;
$sender_email  = 'victorlee@dimantech.com.cn';
$sender_pwd    = 'hJiLW8B4SrHuq2VL';
$receive_email = 'victorlee@dimantech.com.cn';

// 接收表单数据
$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$company = trim($_POST['company'] ?? '');
$demand  = trim($_POST['demand'] ?? '');
$type    = trim($_POST['type'] ?? '网站表单咨询');

// 简单验证
if (empty($name) || empty($phone) || empty($demand)) {
    echo json_encode(['code' => 0, 'msg' => '请填写完整必填项']);
    exit;
}

// 邮件标题和内容
$subject = "【迪曼微电子】$type - $name";
$body = "
<html>
<head><meta charset='utf-8'></head>
<body>
<h3>$type</h3>
<p><strong>姓名：</strong>$name</p>
<p><strong>公司：</strong>$company</p>
<p><strong>电话：</strong>$phone</p>
<p><strong>邮箱：</strong>$email</p>
<p><strong>内容：</strong><br>$demand</p>
<p>提交时间：" . date('Y-m-d H:i:s') . "</p>
</body>
</html>
";

// 邮件头
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: 迪曼微电子官网 <$sender_email>\r\n";
$headers .= "Reply-To: $sender_email\r\n";

// 连接 SMTP 发信
$fp = fsockopen('ssl://smtp.exmail.qq.com', 465, $errno, $errstr, 10);
if (!$fp) {
    echo json_encode(['code' => 0, 'msg' => '连接邮箱服务器失败']);
    exit;
}

socket_set_timeout($fp, 10);
fputs($fp, "EHLO smtp.exmail.qq.com\r\n");
fputs($fp, "AUTH LOGIN\r\n");
fputs($fp, base64_encode($sender_email) . "\r\n");
fputs($fp, base64_encode($sender_pwd) . "\r\n");
fputs($fp, "MAIL FROM:<$sender_email>\r\n");
fputs($fp, "RCPT TO:<$receive_email>\r\n");
fputs($fp, "DATA\r\n");
fputs($fp, "$headers\r\nSubject: $subject\r\n\r\n$body\r\n.\r\n");
fputs($fp, "QUIT\r\n");

$resp = '';
while (!feof($fp)) {
    $resp .= fgets($fp, 512);
}
fclose($fp);

// 成功判断
if (strpos($resp, '250 Ok') !== false || strpos($resp, '250 Queue') !== false) {
    echo json_encode(['code' => 1, 'msg' => '提交成功！我们会尽快与您联系']);
} else {
    echo json_encode(['code' => 0, 'msg' => '提交失败，请检查邮箱授权码']);
}
?>