const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

async function sendVerificationEmail(email, token, firstName) {
    try {

        const msg = {
            subject: "Account Verification Token",
            to: email,
            from: process.env.FROM_EMAIL,
            link: `http://${process.env.HOST}:${process.env.CLIENT_PORT}/verification?token=${token}&email=${to}`,
            templateId: process.env.EMAIL_TEMPLATE,
            dynamic_template_data: {
                firstName,
                link
            }
        }

        await sendEmail(msg);

    } catch (error) {
        return new Error(`Something went wrong ! - ${error}`)
    }
}



module.exports = sendVerificationEmail;