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
        taskItem.classList.add('task-item');

        if (tarefa.concluida) {
            taskItem.classList.add('concluida');
        }

        taskItem.innerHTML = tarefa.html;
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

        // Formatando a data no padrão dd/mm/aa ou dd/mm/aa
        // Criando um array do valor capturado do input Date
        const dataInput = taskDate.split('-');
        console.log(dataInput);

        // 
        const dataFormatada = `${dataInput[2]}/${dataInput[1]}/${dataInput[0]}`;


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
        taskList.appendChild(taskItem);

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

// Concluir tarefa
const marcarComoConcluida = (button) => {

    // Encontrar o elemento pai mais próximo com a classe 
    const taskItem = button.closest('.task-item');
    console.log(taskItem);

    // Verificar se a tarefa já possui a classe 'concluida'
    if (taskItem.classList.contains('concluida')) {
        alert('Está tarefa já foi concluída!');
        return;
    }

    // Adicionar a classe 'concluida' ao elemento da tarefa
    taskItem.classList.add('concluida');

    // Desabilitar botões de edição e exclusão
    const editBtn = taskItem.querySelector('.edit-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    editBtn.disabled = true;
    deleteBtn.disabled = true;

    // Atualizar localStorage
    const taskName = taskItem.querySelector('h3').textContent;
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefaIndex = tarefas.findIndex(t => t.nome === taskName);

    // Verificar se a tarefa foi encontrada e atualizar o status de conclusão e HTML
    if (tarefaIndex !== -1) {

        // Atualizar o valor das chaves do objeto tarefa
        tarefas[tarefaIndex].concluida = true;
        tarefas[tarefaIndex].html = taskItem.innerHTML;

        // Salvar as alterações no localStorage
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
    // Exibir alerta após a conslusão da tarefa
    setTimeout(() => {
        alert('Tarefa marcada como concluída!');
    }, 200);
};

// // Editar tarefa, minha logica
// const editarTarefa = (botao) => {
//     const taskItem = botao.closest('.task-item');

//     // Pegando os elementos atuais
//     const nomeAtual = taskItem.querySelector('h3').innerText;
//     const descricaoAtual = taskItem.querySelector('p').innerText;

//     // Pedindo novo nome e descrição
//     const novoNome = prompt('Editar nome da tarefa:', nomeAtual);
//     const novaDescricao = prompt('Editar descrição da tarefa:', descricaoAtual);

//     // Se o usuário cancelar algum dos prompts, não faz nada
//     if (novoNome === null || novaDescricao === null) return;

//     // Pegando data/hora atuais da tarefa (para manter)
//     const dataHora = taskItem.querySelectorAll('p')[1].innerText;

//     // Atualizando HTML da tarefa
//     const novoHTML = `
//         <h3>${novoNome}</h3>
//         <p>${novaDescricao}</p>
//         <p><strong>${dataHora}</strong></p>
//         <div class="task-actions">
//             <button class="complete-btn">Concluir</button>
//             <button class="edit-btn">Editar</button>
//             <button class="delete-btn">Excluir</button>
//         </div>
//     `;

//     taskItem.innerHTML = novoHTML;

//     // Re-adiciona os eventos aos botões
//     const btnConcluir = taskItem.querySelector('.complete-btn');
//     const btnEditar = taskItem.querySelector('.edit-btn');
//     const btnExcluir = taskItem.querySelector('.delete-btn');

//     if (btnConcluir) {
//         btnConcluir.addEventListener('click', function () {
//             marcarComoConcluida(this);
//         });
//     }

//     if (btnEditar) {
//         btnEditar.addEventListener('click', function () {
//             editarTarefa(this);
//         });
//     }

//     if (btnExcluir) {
//         btnExcluir.addEventListener('click', function () {
//             excluirTarefa(this);
//         });
//     }

//     // Atualizar localStorage
//     const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
//     const index = Array.from(document.querySelectorAll('.task-item')).indexOf(taskItem);

//     if (index > -1) {
//         tarefas[index].nome = novoNome;
//         tarefas[index].descricao = novaDescricao;
//         tarefas[index].html = novoHTML;
//         localStorage.setItem('tarefas', JSON.stringify(tarefas));
//     }
// };

// // Editar tarefa, logica Do Ivo
const editarTarefa = (button) => {
    const taskItem = button.closest('.task-item');

    const newName = prompt('Edite o nome da tarefa:', taskItem.querySelector('h3').textContent);
    const newDescription = prompt('Edite a descrição da tarefa:', taskItem.querySelector('h3').textContent);

    if (newName) taskItem.querySelector('h3').textContent = newName;
    if (newDescription) taskItem.querySelector('p').textContent = newDescription;
}

// Excluir tarefa do localStorage e do DOM
const excluirTarefa = (button) => {
    if (confirm('Deseja realmente excluir para a tarefa?')) {
        const taskItem = button.closest('.task-item');
        const taskName = taskItem.querySelector('h3').textContent;

        // Atualizar localStorage
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

        // O filtro retorna um novo array com todas as tarefas que não
        // corresponde ao nome da tarefa que foi clicada para excluir.
        tarefas = tarefas.filter(t => t.nome !== taskName);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        // Remover o item selecionado
        taskItem.remove();

        alert('Tarefa excluida.');

    }

}