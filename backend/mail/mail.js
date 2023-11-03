const nodemailer = require("nodemailer");
// Hàm để gửi email
module.exports = async function sendEmail(
  to,
  subject,
  text,
  html,
  attachments = []
) {
  // Tạo một transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Thay bằng dịch vụ email của bạn hoặc cung cấp cài đặt SMTP
    auth: {
      user: "rongvang2357hn@gmail.com", // Địa chỉ email của bạn
      pass: "zorw khho cvzy kohe", // Mật khẩu email của bạn hoặc ứng dụng mật khẩu
    },
  });

  // Thông tin email
  const mailOptions = {
    from: "rongvang2357hn@gmail.com",
    to: to,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments,
  };

  try {
    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi:", info.response);
    return true;
  } catch (error) {
    console.error("Gửi email thất bại:", error);
    return false;
  }
};
