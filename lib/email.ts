export const getVerificationEmailTemplate = (verificationUrl: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Подтверждение email</h1>
      <p style="margin-bottom: 20px;">Пожалуйста, подтвердите ваш email, нажав на кнопку ниже:</p>
      <a href="${verificationUrl}" 
        style="display: inline-block; padding: 12px 24px; 
        background-color: #4CAF50; color: white; 
        text-decoration: none; border-radius: 4px; font-weight: bold;">
        Подтвердить email
      </a>
      <p style="margin-top: 20px; color: #777;">
        Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.
      </p>
    </div>
  `;
};

export const verificationEmailSubject = "Подтвердите ваш email";
