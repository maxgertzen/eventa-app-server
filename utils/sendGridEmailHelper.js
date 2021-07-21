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

async function sendVerificationEmail(email, token, id, firstName, req, res) {
    try {

        let subject = "Account Verification Token";
        let to = email;
        let from = process.env.FROM_EMAIL;
        let link = `http://${process.env.HOST}/verification?token=${token}&email=${to}`;
        let html = `<p>Hi ${firstName}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        await sendEmail({ to, from, subject, html });

        let userString = id + '?' + firstName;
        res.cookie('user', userString);
        res.status(200).json({ message: 'A verification email has been sent to ' + email + '.' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



module.exports = sendVerificationEmail;