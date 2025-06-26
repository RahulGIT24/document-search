def get_verification_email_template(name:str,frontend_url:str,token:str):
    return f'''
    <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">Welcome, {name}!</h2>
            <p>Thank you for registering with us. Please verify your account by clicking the button below:</p>

            <a href="{frontend_url}/verify-token?token={token}" 
                style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                Verify My Account
            </a>

            <p style="margin-top: 30px;">If the button doesn’t work, please copy and paste the link below into your browser:</p>
            <p style="color: #555;">{frontend_url}/verify-token?token={token}</p>

            <p style="color: #888;">–This is valid for 4 hours Only</p>
            <p style="margin-top: 40px;">If you did not register, please ignore this email.</p>

            </div>
        </body>
        </html>
'''

def get_reset_password_mail(name:str,frontend_url:str,token:str):
    return f'''
    <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333;">Hello, {name}!</h2>
            <p>We came to know that you forgot your password.</p>

            <a href="{frontend_url}/reset-password?token={token}" 
                style="display: inline-block; padding: 12px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                Reset Password
            </a>

            <p style="margin-top: 30px;">If the button doesn’t work, please copy and paste the link below into your browser:</p>
            <p style="color: #555;">{frontend_url}/reset-password?token={token}</p>

            <p style="color: #888;">–This is valid for 4 hours Only</p>
            <p style="margin-top: 40px;">If you did not request this, please ignore this email.</p>

            </div>
        </body>
        </html>
'''