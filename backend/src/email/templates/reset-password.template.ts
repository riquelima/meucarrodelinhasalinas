export function resetPasswordTemplate(userName: string, token: string, frontendUrl: string) {
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; background:#f9fafb; padding: 30px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;">
        <div style="background:#111827;color:white;padding:20px;text-align:center;">
          <h2>Redefinir sua senha 🔒</h2>
        </div>
        <div style="padding:20px;">
          <p>Olá <b>${userName}</b>,</p>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          <p>
            <a href="${resetLink}" 
               style="display:inline-block;padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
              Redefinir Senha
            </a>
          </p>
          <p>Se você não fez essa solicitação, ignore este e-mail.</p>
          <p style="margin-top:20px;">Abraços,<br>Equipe Meu Carro de Linha</p>
        </div>
      </div>
    </div>
  `;
}
