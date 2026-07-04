exports.courseEnrollmentEmail = (courseName, name) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Enrollment Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:Arial, Helvetica, sans-serif; color:#1d1633;">
	<div style="max-width:520px; margin:24px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e1f2;">
		<div style="background-color:#4c1d95; padding:22px; text-align:center;">
			<span style="color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:0.5px;">Code<span style="color:#a78bfa;">Scholar</span></span>
		</div>
		<div style="padding:28px;">
			<h1 style="font-size:20px; margin:0 0 16px 0; color:#1d1633; text-align:center;">You're enrolled!</h1>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">Dear ${name},</p>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">You have successfully enrolled in <b style="color:#4c1d95;">&ldquo;${courseName}&rdquo;</b>. We're excited to have you on board!</p>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 12px;">Log in to your dashboard to access the course materials and start learning.</p>
			<div style="text-align:center; margin:24px 0 4px;">
				<a href="https://codescholar.vercel.app/dashboard/enrolled-courses" style="display:inline-block; background-color:#7c4dff; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:15px; font-weight:bold;">Go to Dashboard</a>
			</div>
		</div>
		<div style="background-color:#faf8ff; padding:16px; text-align:center; font-size:12px; color:#8a83a3;">Need help? <a href="mailto:info@codescholar.com" style="color:#7c4dff; text-decoration:none;">info@codescholar.com</a> &nbsp;&middot;&nbsp; &copy; CodeScholar</div>
	</div>
</body>
</html>`;
};
