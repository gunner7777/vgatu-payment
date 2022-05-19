<?php
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: https://pay.vgsha.info/*");
header("AMP-Access-Control-Allow-Source-Origin: https://pay.vgsha.info/*");
header("Access-Control-Expose-Headers: AMP-Access-Control-Allow-Source-Origin");

$serviceList = array(
    "f0" => "Проживание в общежитии",
    "f1" => "Платное образование (ВО)",
    "f2" => "Платное образование (СПО)",
    "f3" => "Платное образование (ДО)",
    "f5" => "Квартплата",
    "f6" => "Пожертвования",
    "f7" => "Прочее",
);

$config = include($_SERVER['DOCUMENT_ROOT'] . '/php/config.php');

if (isset($_POST['serviceId']) && isset($_POST['namePayer']) && isset($_POST['contract']) && isset($_POST['payment'])) {
  $serviceId = trim(htmlspecialchars($_POST['serviceId']));
  $jsonParams = array();

  $jsonParams['serviceName'] = $serviceList[$serviceId];
  $jsonParams['namePayer'] = trim(htmlspecialchars($_POST['namePayer']));
  $jsonParams['contract'] = trim(htmlspecialchars($_POST['contract']));
  $payment = createCorrectPayment(trim(htmlspecialchars($_POST['payment'])));
  if (isset($_POST['nameEdu'])) {
    $jsonParams['nameEdu'] = trim(htmlspecialchars($_POST['nameEdu']));
  }
  if (isset($_POST['courseName'])) {
    $jsonParams['courseName'] = trim(htmlspecialchars($_POST['courseName']));
  }

  switch ($serviceId) {
    case "f0":
    case "f1":
    case "f2":
    case "f3":
    case "f5":
    case "f7":
      $jsonParams['KBK'] = $config['KBK']['main'];
      break;
    case "f6":
      $jsonParams['KBK'] = $config['KBK']['donate'];
      break;
    default:
      header('Location: ./php/error.php');
      break;
  }

  $url = $config['urlRegister'];
  $data = array(
      'orderNumber' => getUniqueOrderId(),
      'amount' => $payment,
      'returnUrl' => $config['returnUrl'],
      'userName' => $config['merchant']['test']['login'],
      'password' => $config['merchant']['test']['password'],
      'currency' => '643',
      'jsonParams' => json_encode($jsonParams),
  );

  $options = array(
      'http' => array(
          'header' => "Content-type: application/x-www-form-urlencoded\r\n",
          'method' => 'POST',
          'content' => http_build_query($data)
      )
  );

  $context = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  if ($result === FALSE) {
    //echo json_encode(array('errorMessage' => $result));
  } else {
    //echo json_encode(array("status" => "ok"));
  }

  $r = json_decode($result);

  header('Location: ' . $r->formUrl);
} else {
  header('Location: ./php/error.php');
}

/**
 * get uniq id for order
 * format: (substring of Unix time)-(substring of milliseconds+random[0-9])
 */
function getUniqueOrderId()
{
  $uniqOrderId = microtime();
  return substr($uniqOrderId, strlen($uniqOrderId) - 9, strlen($uniqOrderId)) . "-" . substr($uniqOrderId, 2, 4) . rand(0, 9);
}

/**
 * cast rubles and pennies in pennies only. If only rubles then add '00' at the end of payment as pennies
 * @param $pay - payment from user
 * @return string - payment in pennies
 *
 */
function createCorrectPayment($pay) {
  $parts = explode('.', $pay);
  if (count($parts) < 2) {
    return $parts[0] . "00";
  } else {
    return $parts[0] . $parts[1];
  }
}

