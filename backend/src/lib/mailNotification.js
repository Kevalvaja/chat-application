import nodemailer from "nodemailer"
export const MailNotification = async (email, subject, message) => {
    return await new Promise(async (resolve, reject) => {
        try {
            const auth = {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: auth
            });

            const info = await transporter.sendMail({
                from: `<${auth.user}>`,  // Sender's email
                to: email,  // Receiver's email
                subject: `${process.env.APPLICATION_NAME} ${subject}`,
                html: message,
            });
            console.log(info.messageId)
            resolve(info.messageId);
            return;
        } catch (error) {
            console.error("Error sending email:", error);
            reject(error);
            return;
            // return res?.status(500).json({ message: "Internal Server Error" })
        }
    })
}