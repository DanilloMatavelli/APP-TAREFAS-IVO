function updateSaudacao() {
    const now = new Date();
    const hours = now.getHours();

    let greeting = '';
    if (hours < 12) {
        greeting = 'Bom dia';
    } else if (hours < 18) {
        greeting = 'Boa tarde';
    } else {
        greeting = 'Boa noite';
    }

    const dateTimeString = `${greeting}`;
    document.getElementById('saudacaoHeader').textContent = dateTimeString;
}

// Atualiza imediatamente ao carregar
updateSaudacao();

// Atualiza a cada segundo
setInterval(updateSaudacao, 1000);
