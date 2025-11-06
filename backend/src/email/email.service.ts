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
      from: 'onboarding@resend.dev',
      to,
      subject: 'Bem-vindo ao Meu Carro de Linha!',
      html: welcomeTemplate(userName),
    });
  }

  async sendResetPasswordEmail(to: string, userName: string, token: string) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Redefinição de Senha',
      html: resetPasswordTemplate(userName, token, process.env.CLIENT_URL || 'http://localhost:5173'),
    });
  }

  async sendSupportEmail(fromEmail: string, message: string) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'andreymatheus92@gmail.com',
      replyTo: fromEmail,
      subject: `📩 Novo contato via site`,
      html: supportContactTemplate(fromEmail, message),
    });
  }
}
