export function welcomeTemplate(userName: string) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f9fafb; padding: 30px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;">
        <div style="background:#111827;color:white;padding:20px;text-align:center;">
          <h2>Bem-vindo ao Meu Carro de Linha 🚙</h2>
        </div>
        <div style="padding:20px;">
          <p>Olá <b>${userName}</b>!</p>
          <p>Estamos felizes por ter você conosco. Explore o app e aproveite todos os recursos!</p>
          <p style="margin-top:20px;">Abraços,<br>Equipe Meu Carro de Linha</p>
        </div>
      </div>
    </div>
  `;
}
