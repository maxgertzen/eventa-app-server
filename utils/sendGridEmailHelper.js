const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const sendVerificationEmail = (to, token) => {
    const hostUrl = process.env.HOST;
    const request = sgMail.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: {
            personalizations: [
                {
                    to: [
                        {
                            email: to
                        }
                    ],
                    subject: "Verify Your Email - EventaApp"
                }
            ],
            from: {
                email: "eventaapp.team@gmail.com"
            },
            content: [
                {
                    type: 'text/plain',
                    value: `Click on this link to verify your email ${hostUrl}/verification?token=${token}&email=${to}`
                }
            ]
        }
    });
    return new Promise(function (resolve, reject) {
        sgMail.API(request, function (error, response) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(response);
            }
        });
    });
};


module.exports = sendVerificationEmail;