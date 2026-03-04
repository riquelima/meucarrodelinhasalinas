import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { welcomeTemplate } from './templates/welcome.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { supportContactTemplate } from './templates/support-contact.template';
import { APP_CONFIG } from '../config';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(APP_CONFIG.RESEND_API_KEY);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    return this.resend.emails.send({
      from: `${APP_CONFIG.EMAIL_FROM_NAME} <${APP_CONFIG.EMAIL_FROM || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to,
      subject: 'Bem-vindo ao Meu Carro de Linha!',
      html: welcomeTemplate(userName),
    });
  }

  async sendResetPasswordEmail(to: string, userName: string, token: string) {
    return this.resend.emails.send({
      from: `${APP_CONFIG.EMAIL_FROM_NAME} <${APP_CONFIG.EMAIL_FROM || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to,
      subject: 'Redefinição de Senha',
      html: resetPasswordTemplate(userName, token, APP_CONFIG.CLIENT_URL || 'meucarrodelinhasalinas.com.br'),
    });
  }

  async sendSupportEmail(fromEmail: string, message: string) {
    return this.resend.emails.send({
      from: `${APP_CONFIG.EMAIL_FROM_NAME} <${APP_CONFIG.EMAIL_FROM || 'no-reply@meucarrodelinhasalinas.com.br'}>`,
      to: `${APP_CONFIG.EMAIL_SUPORTE || 'suporte.meucarrodelinha@gmail.com'}`,
      replyTo: fromEmail,
      subject: `📩 Novo contato via site`,
      html: supportContactTemplate(fromEmail, message),
    });
  }
}

