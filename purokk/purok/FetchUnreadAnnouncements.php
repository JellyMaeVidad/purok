<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/headers.php';
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/firebase/php-jwt/src/JWT.php';
require_once __DIR__ . '/db.php';

session_start();

function validateToken($token) {
    $key = "shytmiming";
    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return $decoded;
    } catch (\Firebase\JWT\ExpiredException $e) {
        $response = [
            'error' => 'Token has expired',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        $response = [
            'error' => 'Invalid JWT Signature',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    } catch (Exception $e) {
        $response = [
            'error' => 'Token validation failed',
            'message' => $e->getMessage(),
        ];
        http_response_code(401);
        echo json_encode($response);
        return null;
    }
}

function fetchUnreadAnnouncementsCount($conn, $userId) {
    $sql = "SELECT COUNT(*) AS unreadAnnouncementsCount FROM request_documents WHERE visibility_flag = 'requestvisible' AND is_confirmed = 'unconfirm' AND user_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        error_log('SQL prepare error: ' . $conn->error);
        return 0;
    }

    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $stmt->bind_result($unreadAnnouncementsCount);
    $stmt->fetch();
    $stmt->close();

    return $unreadAnnouncementsCount;
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $authHeader = filter_input(INPUT_SERVER, 'HTTP_AUTHORIZATION', FILTER_SANITIZE_STRING);

    if ($authHeader) {
        error_log('Received Authorization Header: ' . $authHeader);

        if (strpos($authHeader, 'Bearer') === 0) {
            $token = substr($authHeader, 7);
            $decoded = validateToken($token);

            if ($decoded) {
                $userId = $decoded->userId; // Assuming the JWT contains userId

                // Fetch the count of unread announcements for the user
                $unreadAnnouncementsCount = fetchUnreadAnnouncementsCount($conn, $userId);

                // Check if the user has announcements
                if ($unreadAnnouncementsCount > 0) {
                    // If there are announcements, return the count
                    $responseData = [
                        "success" => true,
                        "unreadAnnouncements" => $unreadAnnouncementsCount,
                    ];
                } else {
                    // If there are no announcements, return 0
                    $responseData = [
                        "success" => true,
                        "unreadAnnouncements" => 0,
                    ];
                }

                echo json_encode($responseData);
            } // validateToken function will handle invalid token responses
        } else {
            http_response_code(400);
            $responseData = ["success" => false, "message" => "Invalid token format"];
            echo json_encode($responseData);
        }
    } else {
        http_response_code(400);
        $responseData = ["success" => false, "message" => "Authorization header missing"];
        echo json_encode($responseData);
    }
}

?>
