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

    // Adicionando event listeners para os botões
    document.querySelector('#adicionarTarefaBtn').addEventListener('click', function (e) {
        e.preventDefault();
        adicionarTarefa();
    });

    // Event listeners para os botões de filtro
    document.querySelector('#filtrarTodasBtn').addEventListener('click', function () {
        filtrarTarefas('todas');
    });

    document.querySelector('#filtrarPendentesBtn').addEventListener('click', function () {
        filtrarTarefas('pendentes');
    });

    document.querySelector('#filtrarConcluidasBtn').addEventListener('click', function () {
        filtrarTarefas('concluidas');
    });

    // Event listeners para os botões de ordenação
    document.querySelector('#ordenarRecentesBtn').addEventListener('click', function () {
        ordenarTarefas('recentes');
    });

    document.querySelector('#ordenarAntigasBtn').addEventListener('click', function () {
        ordenarTarefas('antigas');
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

// Funções para filtrar tarefas
const filtrarTarefas = (filtro) => {
    const tarefas = document.querySelectorAll('.task-item');

    // Percorrer cada tarefa e exibe ou esconde de acordo com o filtro selecionado
    tarefas.forEach(tarefa => {

        // O Switch verifica o valor do filtro e exibe ou esconde a tarefa
        // de acordo com o filtro selecionado
        switch (filtro) {
            case 'todas':
                tarefa.style.display = 'block';
                // O break é usado para sair do switch depois de executar a tarefa
                // correspondente ao filtro selecionado
                break;
            case 'pendentes':
                // O operador ternário verifica se a tarefa possui a classe 'concluida'
                // e exibe ou esconde a tarefa de acordo com o filtro selecionado
                tarefa.style.display = tarefa.classList.contains('concluida') ? 'none' : 'block';
                break;
            case 'concluidas':
                tarefa.style.display = tarefa.classList.contains('concluida') ? 'block' : 'none';
                break;
        }
    });
}
// Minha Lógica
// function ordenarTarefas(ordem) {
//     // Pega o elemento HTML que contém a lista de tarefas (div com id 'taskList')
//     const lista = document.getElementById('taskList');

//     // Pega todos os elementos com a classe 'task-item' dentro da lista e transforma em array(Lista)
//     const tarefas = Array.from(lista.querySelectorAll('.task-item'));
//     console.log(tarefas);

//     // Função auxiliar para extrair a data da tarefa e converter para objeto Date do JavaScript
//     function pegarData(tarefa) {

//         // Pega o texto do elemento <strong> dentro do <p>, que contém a data no formato "dd/mm/aaaa"
//         const dataTexto = tarefa.querySelector('p strong').textContent;

//         // Pega o texto da hora (ex: "14:30")
//         const horaTexto = tarefa.querySelector('.taskTime').textContent;

//         // Quebra a string da data (ex: "25/12/2024") em partes separadas pelo '/', criando um array ["25", "12", "2024"]
//         // Em seguida, converte cada uma dessas partes de string para número usando map(Number)
//         const [diaTarefa, mesTarefa, anoTarefa] = dataTexto.split('/').map(Number);

//         // Separa hora e minuto
//         const [hora, minuto] = horaTexto.split(':').map(Number);

//         // Cria e retorna um objeto Date (mes - 1 porque o JS começa do zero)
//         // Retorna um objeto Date completo com data e hora
//         return new Date(anoTarefa, mesTarefa - 1, diaTarefa, hora, minuto);
//     }


//     // Ordena o array de tarefas com base na data
//     tarefas.sort((tarefa1, tarefa2) => {
//         if (ordem === 'recentes') {
//             // Se o parâmetro for "recentes", coloca as tarefas mais novas primeiro
//             return pegarData(tarefa1) - pegarData(tarefa2) || pegarHora(horas1) - pegarHora(horas2); // mais recentes primeiro
//         } else {
//             // Se não for "recentes" (qualquer outro valor), coloca as mais antigas primeiro
//             return pegarData(tarefa2) - pegarData(tarefa1) || pegarHora(horas2) - pegarHora(horas1); // mais antigas primeiro
//         }
//     });

//     // Limpa o conteúdo atual da lista (removendo tarefas antigas do HTML)
//     lista.innerHTML = '<h2>Suas Tarefas</h2>';

//     // Reinsere as tarefas no HTML, agora na ordem correta
//     tarefas.forEach(tarefa => lista.appendChild(tarefa));
// };

// Lógica com o Professor
function ordenarTarefas(ordem) {

    // Obter a lista de tarefas e os dados do localStorage
    const taskList = document.querySelector('#taskList');

    // Converter a coleção de tarefas em um array
    const tarefas = Array.from(document.querySelectorAll('.task-item'));

    // Obter os dados das tarefas do localStorage
    const dadosTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    // Ordenar as tarefas com base na ordem selecionada
    // O sort() é um método que ordena os elementos de um array
    // A função de comparação recebe dois argumentos, a e b, que são os elementos a serem comparados
    tarefas.sort((a,b) => {
        // Obter os nomes das tarefas
        const nomeA = a.querySelector('h3').textContent;
        const nomeB = a.querySelector('h3').textContent;

        // Obter as datas das tarefas
        const tarefaA = dadosTarefas.find(t => t.nome === nomeA);
        const tarefaB = dadosTarefas.find(t => t.nome === nomeB);

        // Converter as datas para objetos Date e comparar padrão ISO 8601(T)
        const dataA = new Date(`${tarefaA.data}T${tarefaB.hora}`);
        const dataB = new Date(`${tarefaB.data}T${tarefaA.hora}`);

        // Ordenar as tarefas com base na ordem selecionada
        return ordem === 'antigas' ? dataA - dataB : dataB - dataA;
    });
}