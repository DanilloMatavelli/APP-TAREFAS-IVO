const definirSaudacao = () => {
    const header = document.querySelector('#saudacaoHeader');
    setInterval(() => {
        const now = new Date();
        const horas = now.getHours();
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const segundos = now.getSeconds().toString().padStart(2, '0');
        const dataAtual = now.toLocaleDateString('pt-BR');

        let saudacao;
        if (horas >= 6 && horas < 12) {
            saudacao = 'Bom Dia!';
        } else if (horas >= 12 && horas < 18) {
            saudacao = 'Boa Tarde!';
        } else {
            saudacao = 'Boa Noite!';
        }

        header.innerHTML = `<span>${saudacao}</span> <span>${dataAtual} ${horas}:${minutos}:${segundos}</span>`;
    }, 1000); // Atualiza a cada segundo
};

// Chamada da função
definirSaudacao();
