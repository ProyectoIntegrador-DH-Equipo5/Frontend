import emailjs from '@emailjs/browser';
import axiosConfig from "./axiosConfig";

export const emailService = {

  registerConfirmation: async (userEmail, userName, setEmailStatus) => {
    try {
      const baseUrl = import.meta.env.PROD
      ? axiosConfig.defaults.baseURL  // URL de producción de axiosConfig
      : 'http://localhost:8080';
      
      const loginUrl = `${baseUrl}/api/auth/login`;

      await emailjs.send(
        'service_g4ywxm6',  // Service ID de EmailJS
        'template_qq0x3dc', // Template ID
        {
          user_email: userEmail,
          user_name: userName,
          login_url: loginUrl,
          to_email: userEmail,
        },
        '2Pgg6a24lfS4J2fVD'   // Public Key de EmailJS
      );
      setEmailStatus({
        sent: true,
        error: false,
        message: '¡Email de confirmación enviado exitosamente!'
      });
      return { success: true }; // Explicitly returning success

    } catch (error) {
      console.error('Error al enviar email:', error);
      setEmailStatus({
        sent: false,
        error: true,
        message: 'Error al enviar el email de confirmación'
      });
      return { success: false }; // Return failure explicitly
    }
  }
}