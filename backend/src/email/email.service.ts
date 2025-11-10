import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { welcomeTemplate } from './templates/welcome.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { supportContactTemplate } from './templates/support-contact.template';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    return this.resend.emails.send({
      from: `Meu Carro de Linha <${process.env.EMAIL_FROM?.toString() || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to,
      subject: 'Bem-vindo ao Meu Carro de Linha!',
      html: welcomeTemplate(userName),
    });
  }

  async sendResetPasswordEmail(to: string, userName: string, token: string) {
    return this.resend.emails.send({
      from: `Meu Carro de Linha <${process.env.EMAIL_FROM?.toString() || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to,
      subject: 'Redefinição de Senha',
      html: resetPasswordTemplate(userName, token, process.env.CLIENT_URL  || 'meucarrodelinhasalinas.com.br'),
    });
  }

  async sendSupportEmail(fromEmail: string, message: string) {
    return this.resend.emails.send({
      from: `Meu Carro de Linha <${process.env.EMAIL_FROM?.toString() || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to: `${process.env.EMAIL_SUPORTE?.toString() || 'suporte.meucarrodelinha@gmail.com'}`,
      replyTo: fromEmail,
      subject: `📩 Novo contato via site`,
      html: supportContactTemplate(fromEmail, message),
    });
  }
}
