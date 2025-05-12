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


// Carrefar tarefas do localStorage ao iniciar
const carregarTarefas = () => {
    const taskList = document.querySelector('#taskList');
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.forEach(tarefa => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item'); // "task-item", não "task-list" para cada item individual

        if (tarefa.concluida) {
            taskItem.classList.add('concluida');
        }

        taskItem.innerHTML = tarefa.html; // corrigido: tarefa.html, não tarefas.html
        taskList.appendChild(taskItem);

        // Adicionar event listeners aos botões da tarefa (se existirem)
        const btnConcluir = taskItem.querySelector('.complete-btn');
        const btnEditar = taskItem.querySelector('.edit-btn');
        const btnExcluir = taskItem.querySelector('.delete-btn');

        if (btnConcluir) {
            btnConcluir.addEventListener('click', function () {
                marcarComoConcluida(this);
            });
        }

        if (btnEditar) {
            btnEditar.addEventListener('click', function () {
                editarTarefa(this);
            });
        }

        if (btnExcluir) {
            btnExcluir.addEventListener('click', function () {
                excluirTarefa(this);
            });
        }
    });
};


// Função para adicionar uma nova tarefa
const adicionarTarefa = () => {
    const taskName = document.querySelector('#taskName').value;
    const taskDescription = document.querySelector('#taskDescription').value;
    const taskDate = document.querySelector('#taskDate').value;
    const taskTime = document.querySelector('#taskTime').value;

    if (taskName && taskDate && taskTime) {
        const taskList = document.querySelector('#taskList');
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const dataFormatada = new Date(taskDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

        const taskHTML = `
            <h3>${taskName}</h3>
            <p>${taskDescription}</p>
            <p><strong>${dataFormatada}</strong> ${taskTime}</p>
            <div class="task-actions">
                <button class="complete-btn">Concluir</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </div>
        `;

        taskItem.innerHTML = taskHTML;
        taskList.appendChild(taskItem); // <- só depois disso procure os botões

        // Agora os botões existem no DOM, então podemos adicionar os event listeners com segurança
        const btnConcluir = taskItem.querySelector('.complete-btn');
        const btnEditar = taskItem.querySelector('.edit-btn');
        const btnExcluir = taskItem.querySelector('.delete-btn');

        if (btnConcluir) {
            btnConcluir.addEventListener('click', function () {
                marcarComoConcluida(this);
            });
        }

        if (btnEditar) {
            btnEditar.addEventListener('click', function () {
                editarTarefa(this);
            });
        }

        if (btnExcluir) {
            btnExcluir.addEventListener('click', function () {
                excluirTarefa(this);
            });
        }

        // Salva no localStorage
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.push({
            nome: taskName,
            descricao: taskDescription,
            data: taskDate,
            hora: taskTime,
            html: taskHTML,
            concluida: false
        });
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        alert('Tarefa adicionada com sucesso!');
        document.querySelector('#taskForm').reset();
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
};

window.onload = function () {
    definirSaudacao();
    carregarTarefas();

    // Adicionando event listeners para os botões
    document.querySelector('#adicionarTarefaBtn').addEventListener('click', function (e) {
        e.preventDefault();
        adicionarTarefa();
    });
};