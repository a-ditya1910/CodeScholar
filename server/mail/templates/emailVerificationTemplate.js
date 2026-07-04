const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>CodeScholar OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:Arial, Helvetica, sans-serif; color:#1d1633;">
	<div style="max-width:520px; margin:24px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e1f2;">

		<div style="background-color:#4c1d95; padding:22px; text-align:center;">
			<span style="color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:0.5px;">Code<span style="color:#a78bfa;">Scholar</span></span>
		</div>

		<div style="padding:28px; text-align:center;">
			<h1 style="font-size:20px; margin:0 0 12px 0; color:#1d1633;">Verify your email</h1>
			<p style="font-size:15px; color:#5b5378; margin:0 0 20px 0; line-height:1.5;">
				Use the One-Time Password (OTP) below to complete your CodeScholar registration.
			</p>

			<div style="display:inline-block; background-color:#f2edfc; border:1px dashed #a78bfa; border-radius:10px; padding:16px 30px; margin:6px 0 18px 0;">
				<span style="font-size:34px; font-weight:bold; letter-spacing:8px; color:#4c1d95;">${otp}</span>
			</div>

			<p style="font-size:13px; color:#8a83a3; margin:0; line-height:1.5;">
				This code is valid for <b>5 minutes</b>. If you didn't request it, you can safely ignore this email.
			</p>
		</div>

		<div style="background-color:#faf8ff; padding:16px; text-align:center; font-size:12px; color:#8a83a3;">
			&copy; CodeScholar &mdash; Learn. Build. Grow.
		</div>

	</div>
</body>
</html>`;
};
module.exports = otpTemplate;
