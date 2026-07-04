exports.contactUsEmail = (
	email,
	firstname,
	lastname,
	message,
	phoneNo,
	countrycode
) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Contact Form Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:Arial, Helvetica, sans-serif; color:#1d1633;">
	<div style="max-width:520px; margin:24px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e1f2;">
		<div style="background-color:#4c1d95; padding:22px; text-align:center;">
			<span style="color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:0.5px;">Code<span style="color:#a78bfa;">Scholar</span></span>
		</div>
		<div style="padding:28px;">
			<h1 style="font-size:20px; margin:0 0 16px 0; color:#1d1633; text-align:center;">We received your message</h1>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">Dear ${firstname} ${lastname},</p>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 16px;">Thank you for reaching out. We've received your message and will get back to you as soon as possible.</p>
			<table style="width:100%; border-collapse:collapse; font-size:14px; background-color:#faf8ff; border-radius:8px;">
				<tr><td style="padding:10px 14px; color:#8a83a3;">Name</td><td style="padding:10px 14px; text-align:right; color:#1d1633;">${firstname} ${lastname}</td></tr>
				<tr><td style="padding:10px 14px; color:#8a83a3;">Email</td><td style="padding:10px 14px; text-align:right; color:#1d1633;">${email}</td></tr>
				<tr><td style="padding:10px 14px; color:#8a83a3;">Phone</td><td style="padding:10px 14px; text-align:right; color:#1d1633;">${countrycode} ${phoneNo}</td></tr>
				<tr><td style="padding:10px 14px; color:#8a83a3; vertical-align:top;">Message</td><td style="padding:10px 14px; text-align:right; color:#1d1633;">${message}</td></tr>
			</table>
		</div>
		<div style="background-color:#faf8ff; padding:16px; text-align:center; font-size:12px; color:#8a83a3;">Need help? <a href="mailto:info@codescholar.com" style="color:#7c4dff; text-decoration:none;">info@codescholar.com</a> &nbsp;&middot;&nbsp; &copy; CodeScholar</div>
	</div>
</body>
</html>`;
};
