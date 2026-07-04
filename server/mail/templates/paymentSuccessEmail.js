exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Payment Confirmation</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2fb; font-family:Arial, Helvetica, sans-serif; color:#1d1633;">
	<div style="max-width:520px; margin:24px auto; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e6e1f2;">
		<div style="background-color:#4c1d95; padding:22px; text-align:center;">
			<span style="color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:0.5px;">Code<span style="color:#a78bfa;">Scholar</span></span>
		</div>
		<div style="padding:28px;">
			<h1 style="font-size:20px; margin:0 0 16px 0; color:#1d1633; text-align:center;">Payment successful</h1>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 8px;">Dear ${name},</p>
			<p style="font-size:15px; color:#5b5378; line-height:1.6; margin:0 0 18px;">We've received your payment of <b style="color:#4c1d95;">&#8377;${amount}</b>. Thank you!</p>
			<table style="width:100%; border-collapse:collapse; font-size:14px;">
				<tr><td style="padding:10px 0; color:#8a83a3; border-bottom:1px solid #eee;">Payment ID</td><td style="padding:10px 0; text-align:right; color:#1d1633; border-bottom:1px solid #eee;"><b>${paymentId}</b></td></tr>
				<tr><td style="padding:10px 0; color:#8a83a3;">Order ID</td><td style="padding:10px 0; text-align:right; color:#1d1633;"><b>${orderId}</b></td></tr>
			</table>
		</div>
		<div style="background-color:#faf8ff; padding:16px; text-align:center; font-size:12px; color:#8a83a3;">Need help? <a href="mailto:info@codescholar.com" style="color:#7c4dff; text-decoration:none;">info@codescholar.com</a> &nbsp;&middot;&nbsp; &copy; CodeScholar</div>
	</div>
</body>
</html>`;
};
