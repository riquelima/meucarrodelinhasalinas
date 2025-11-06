export function supportContactTemplate(fromEmail: string, message: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f9fafb; padding: 30px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#111827;color:white;padding:20px;text-align:center;">
          <h2>📩 Novo contato via site</h2>
        </div>

        <!-- Content -->
        <div style="padding:20px;">
          <p>Você recebeu uma nova mensagem enviada através do formulário de contato do site <b>Meu Carro de Linha</b>.</p>

          <p><strong>Remetente:</strong> ${fromEmail}</p>

          <div style="margin-top: 15px; padding:15px; background:#f3f4f6; border-radius:8px;">
            <p style="margin:0; white-space:pre-line;">
              ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
            </p>
          </div>

          <p style="margin-top:20px;">
            Para responder, basta clicar em <b>Responder</b> neste e-mail — nós já configuramos o <i>reply-to</i> 😉.
          </p>

          <p style="margin-top:20px;">Abraços,<br>Equipe Meu Carro de Linha</p>
        </div>

      </div>
    </div>
  `;
}
