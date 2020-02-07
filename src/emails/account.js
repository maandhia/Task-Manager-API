const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "maandhia2015@gmail.com",
    subject: `Hi ${name}, welcome on board!`,
    text: `Hi ${name}, Thank you for joining my email list. Feel free to explore many awsome applications on my website. Cheers!`
  });
};

const sendFarewellEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: "maandhia2015@gmail.com",
    subject: `${name}, we will miss you`,
    text: `Hi ${name}, It is a pleasure of ours that you were a member of our network. If you consider joining again, feel free to use the following link to sign up : link`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendFarewellEmail
};
