const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) {
                console.log('This is error')
                return reject(error)
            };
            console.log('not error')
            return resolve(result);
        });
    });
}

async function sendVerificationEmail(email, token, firstName) {
    try {
        let link = `http://${process.env.HOST}:${process.env.CLIENT_PORT}/verification?token=${token}&email=${email}`
        const msg = {
            subject: "Account Verification",
            to: email,
            from: process.env.FROM_EMAIL,
            link,
            templateId: process.env.EMAIL_TEMPLATE,
            dynamic_template_data: {
                firstName,
                link
            }
        }

        return await sendEmail(msg);

    } catch (error) {
        return new Error(`Something went wrong ! - ${error}`)
    }
}



module.exports = sendVerificationEmail;