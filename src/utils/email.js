require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");



const createTransporter = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  
  const { token: accessToken } = await oAuth2Client.getAccessToken();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "rockthebarrio@gmail.com",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter;
};
const enviarCorreoSemanal = async (destinatario, eventos) => {
  try {
    const transporter = await createTransporter();
    let eventosHTML = '';
    for (const evento of eventos) {
      const dia = evento.date_start.getDate();
      
      eventosHTML += `
       <div style="font-family: Arial, sans-serif; margin: 10px auto ; width:70%;  border: 2px solid #000; border-radius: 10px; padding: 10px 20px; background-image:linear-gradient(to bottom, #f16704, #fff);  ">
        <h2>${evento.title}</h2>
        <span>Artista: </span><h3 style="display: inline;">${evento.subtitle}</h3>
        <p>Data: día <strong>${dia}</strong></p>
        <p>Lugar:<strong> ${evento.site}</strong></p>
        <p>Máis detalles <a href="https://rock-the-barrio-front-one.vercel.app/${evento._id}"> aquí</a></p>
        </div>
        <br/>
      `;
    }

    const contenido = `
     <div style="display: block; width: 100%; text-align:center;"> <p>Ola, ${destinatario.username}!</p>
      <h1><u>EVENTOS SEMANAIS</u></h1>
      ${eventosHTML}
      <p></p>
      <p style="font-size: 10px; color: #555;">Para deixar de recibir este correo semanal preme <a href="https://rock-the-barrio-front-one.vercel.app/reset-password/unsubscribenewsletter"> aquí</a>.</p>
      <p style="font-size: 10px; color: #555;">Podes ver aquí os <a href="https://rock-the-barrio-front-one.vercel.app/terminos"> Termos e Condicións </a> e a nosa <a href="https://rock-the-barrio-front-one.vercel.app/privacidad"> Política de Privacidade</a>.</p>
      </div>`;
    const mensaje = {
      from: "rockthebarrio@gmail.com",
      to: destinatario.email,
      subject: "Eventos da semana",
      html: contenido,
    };
    const respuesta = await transporter.sendMail(mensaje);
    console.log("Correo electrónico enviado:", respuesta);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("No se pudo enviar el correo electrónico.");
  }
};
const enviarCorreoElectronico = async (destinatario, evento) => {
  try {
    const transporter = await createTransporter();

    const dia = evento.date_start.getDate();
    const mes = evento.date_start.getMonth();
    const mesesEnGallego = [
      "Xaneiro",
      "Febreiro",
      "Marzo",
      "Abril",
      "Maio",
      "Xuño",
      "Xullo",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Decembro",
    ];

    const nombreMes = mesesEnGallego[mes];

    const mensaje = {
      from: "rockthebarrio@gmail.com",
      to: destinatario.email,
      subject: "Novo evento musical",
      html: `<p>Ola, ${destinatario.username}!</p><p></p> <p>Engadiuse un novo evento musical:<strong> ${evento.title}</strong> o día <strong>${dia}</strong> de<strong> ${nombreMes}</strong>.</p>
        <p>Máis detalles  <a href="https://rock-the-barrio-front-one.vercel.app/${evento._id}"> aquí.</a></p> <p></p> <p>Para deixar de recibir estes correos preme <a href="https://rock-the-barrio-front-one.vercel.app/reset-password/unsubscribenewevent"> aquí</a>.</p><p>Podes ver aquí os <a href="https://rock-the-barrio-front-one.vercel.app/terminos"> Termos e Condicións </a> e a nosa <a href="https://rock-the-barrio-front-one.vercel.app/privacidad"> Política de Privacidade</a>.</p>`,
    };

    const respuesta = await transporter.sendMail(mensaje);
    console.log("Correo electrónico enviado:", respuesta);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("No se pudo enviar el correo electrónico.");
  }
};
const enviarCorreoRecuperacion = async (destinatario, token) => {
  try {
    const transporter = await createTransporter();

    const mensaje = {
      from: "rockthebarrio@gmail.com",
      to: destinatario.email,
      subject: "Recuperación de contrasinal",
      html: `<p>Ola, ${destinatario.username},</p>
             <p>Semella que solicitaches restablecer o teu contrasinal na nosa aplicación.</p>
             <p>Clica no seguinte enlace para cambia-lo teu contrasinal:</p>
             <a href="https://rock-the-barrio-front-one.vercel.app/reset-password/${token}">Restablecer contrasinal</a>
             <span>(Este enlace caduca en 60 minutos)</span>
             <p>Se non solicitaches restablece-lo teu contrasinal, borra por favor este correo.</p>
             <p>Grazas,</p>
             <p>Rock The Barrio</p></p>`,
    };

    const respuesta = await transporter.sendMail(mensaje);
    console.log("Correo electrónico enviado:", respuesta);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
  }
};
module.exports = {
  enviarCorreoElectronico,
  enviarCorreoSemanal,
  enviarCorreoRecuperacion,
};
