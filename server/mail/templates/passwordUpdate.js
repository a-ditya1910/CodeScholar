exports.passwordUpdated = (email, name) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Password Update Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:Arial, Helvetica, sans-serif; color:#1d1633;">
	<div style="max-width:520px; margin:24px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e1f2;">
		<div style="background-color:#4c1d95; padding:22px; text-align:center;">
			<span style="color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:0.5px;">Code<span style="color:#a78bfa;">Scholar</span></span>
		</div>
		<div style="padding:28px;">
			<h1 style="font-size:20px; margin:0 0 16px 0; color:#1d1633; text-align:center;">Password updated</h1>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">Hey ${name},</p>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">Your password was successfully updated for <b style="color:#4c1d95;">${email}</b>.</p>
			<p style="font-size:14px; color:#8a83a3; line-height:1.6; margin:0;">If you did not request this change, please contact us immediately to secure your account.</p>
		</div>
		<div style="background-color:#faf8ff; padding:16px; text-align:center; font-size:12px; color:#8a83a3;">Need help? <a href="mailto:info@codescholar.com" style="color:#7c4dff; text-decoration:none;">info@codescholar.com</a> &nbsp;&middot;&nbsp; &copy; CodeScholar</div>
	</div>
</body>
</html>`;
};
