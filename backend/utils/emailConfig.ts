import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    }
});

transporter.verify((error, _success) => {
    if (error) console.log("Ошибка SMTP:", error);
    else console.log("SMTP готов к отправке писем!");
});

export default transporter;