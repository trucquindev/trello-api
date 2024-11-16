const brevo = require('@getbrevo/brevo');
import { env } from '~/config/environment';

let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (recipientEmail, name, customSubject, htmlContent) => {
  // Khởi tạo 1 cái sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  // Tai khoản gửi mail : là địa chỉ admin email và là email được tạo trên brevo
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };
  // Những tài khoản nhận email
  // Thông tin email đích
  // to là 1 aray để có thể gửi mail tới nhiều user cùng lúc
  sendSmtpEmail.to = [
    {
      email: recipientEmail,
      name: name,
    },
  ];
  // tiêu đề
  sendSmtpEmail.subject = customSubject;
  // Nội dung email dạng html
  sendSmtpEmail.htmlContent = htmlContent;

  // Gọi hành động gửi email
  // Thằng này sẽ trả về 1 cái promise
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
export const BrevoProvider = {
  sendEmail,
};
