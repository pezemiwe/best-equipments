import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Use real credentials if provided in env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  // Fallback to Ethereal Mail for testing (generates a test account on the fly)
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  
  return transporter;
};

export const sendOrderConfirmationEmail = async (order: any) => {
  try {
    const tp = await getTransporter();
    
    // In a real app, this would be the customer's email (if collected during checkout)
    // For now, we simulate sending to a default address or admin.
    const to = process.env.ADMIN_EMAIL || "admin@bestqualities.com";
    
    const info = await tp.sendMail({
      from: '"Best Qualities Store" <no-reply@bestqualities.com>',
      to,
      subject: `Order Confirmation - ${order.reference}`,
      text: `Hello ${order.customerName || 'Customer'},\n\nYour order (${order.reference}) has been received and is currently pending. Total: ₦${order.total}.\n\nWe will contact you shortly.`,
      html: `
        <h3>Order Confirmation</h3>
        <p>Hello ${order.customerName || 'Customer'},</p>
        <p>Your order <strong>${order.reference}</strong> has been received and is currently pending.</p>
        <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
        <p>We will contact you via WhatsApp to finalize the transaction.</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
