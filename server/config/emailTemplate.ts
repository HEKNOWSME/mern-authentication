export const EmailVerifyTemplate =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        
        .content {
            padding: 20px;
            line-height: 1.6;
            color: #333333;
        }
        
        .otp-box {
            background-color: #f8f8f8;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #2c3e50;
            margin: 10px 0;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
        }
        
        .warning {
            color: #e74c3c;
            font-size: 13px;
            margin-top: 15px;
        }
        
        @media only screen and (max-width: 480px) {
            .container {
                width: 100% !important;
                padding: 10px !important;
            }
            
            .content {
                padding: 10px !important;
            }
            
            .otp-code {
                font-size: 24px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,{{name}}</p>
            <p>We received a request to reset your password. Please use the following OTP (One-Time Password) to complete your password reset:</p>
            
            <div class="otp-box">
                <div class="otp-code">{{otp}}</div>
                <p>This code will expire in 3 minutes</p>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.</p>
            
            <p class="warning">Never share this OTP with anyone. Our team will never ask for your OTP.</p>
            
            <p>Best regards,<br>Claudistack</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© 2025 Claudistack. All rights reserved.</p>
            <p>Claudistack</p>
        </div>
    </div>
</body>
</html>
`