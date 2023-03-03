const nodemailer = require('nodemailer');
//const nodemailerSendgrid = require('nodemailer-sendgrid');
//const sendGridMail = require('@sendgrid/mail');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Momoore Sontan <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendblue
      return nodemailer.createTransport({
        host: process.env.HOST_SENDBLUE,
        port: process.env.PORT_SENDBLUE,
        auth: {
          user: process.env.SENDBLUE_USERNAME,
          pass: process.env.SENDBLUE_PASSWORD,
        },
      });
    }
    // if (process.env.NODE_ENV === 'production') {
    //   //Sendgrid
    //   return nodemailer.createTransport(
    //     nodemailerSendgrid({
    //       apiKey: process.env.SENDGRID_PASSWORD,
    //     })
    //   );
    // }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // async(req, res, next){
  //   if(process.env.NODE_ENV === 'production'){
  //     sendGridMail.setApiKey(process.env.SENDGRID_PASSWORD);

  //     getMessage(){
  //       const html = pug.renderFile(
  //         `${__dirname}/../views/emails/${template}.pug`,
  //         {
  //           firstName: this.firstName,
  //           url: this.url,
  //           subject,
  //         }
  //       );
  //       const mailOption = {
  //         from: this.from,
  //         to: this.to,
  //         subject,
  //         html,
  //         text: htmlToText(html),
  //       };
  //       return sendMail(mailOption)
  //     }
  //     sendEmail(){
  //       try{
  //         await sendGridMail.send(getMessage())
  //       } catch(err){
  //         console.log(err)
  //       }
  //     }
  //     async() => {
  //       await sendEmail()
  //     }
  //   }
  //   return next()
  // }

  //Send actual mail
  async send(template, subject) {
    //1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    //2) Define the email options
    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };
    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOption);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

//const sendEmail = async (options) => {
//1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
//2) Define email options
// const mailOption = {
//   from: 'Momoore Sontan <test@test.io>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   //html:
// };
//3) Actually send the email
//await transporter.sendMail(mailOption);
//};

// module.exports = sendEmail;
