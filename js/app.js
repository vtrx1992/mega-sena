// Uma das maneiras de utilizar objetos no javascript
 
/*  var board = [];
    var currentGame = [];
    var savedGames = [];  */

var state = {board: [], currentGame: [], savedGames: []};

function start (){
    readLocalStorage();
    createBoard();
    newGame();
}
// teste para saber se tem localstorage - não é garantido que todo aparelho vai ter um local Storage.
function readLocalStorage(){
    if(!window.localStorage){
        return;
    }

    var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games');

    if (savedGamesFromLocalStorage) {
        state.savedGames = JSON.parse(savedGamesFromLocalStorage);
    }
}
// função vai ser chamada na hora que clica no botão salvar
// function savedGames(){}
function writeToLocalStorage(){
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

// Função para criar ficha de preenchimento
function createBoard(){
    state.board = []
    // loop de 1 a 60
    for(var i = 1; i <= 60; i++){
        state.board.push(i);
    }
}
// Função para novo jogo, para zerar o jogo
function newGame() {
    resetGame();
    render();
}

function render(){
    renderBoard();
    renderButtons();
    renderSavedGames();
}

// Função para criar uma tabela de numeros
function renderBoard(){
    var divBoard = document.querySelector('#megasena-board');
    divBoard.innerHTML = '';

    var ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');

    for(var i =0; i < state.board.length; i++) {
        var currentNumber = state.board[i];

        var liNumber = document.createElement('li');
        liNumber.textContent = currentNumber;
        liNumber.classList.add('number')

        liNumber.addEventListener('click', handleNumberClick);

        if (isNumberInGame(currentNumber)){
            liNumber.classList.add('select-number');
        }

        ulNumbers.appendChild(liNumber);
    }

    divBoard.appendChild(ulNumbers);
}
// Função para verificar numero escolhido
function handleNumberClick(event){
    var value = Number(event.currentTarget.textContent);
    // verificação que adiciona ou remove numeros do jogo
    if (isNumberInGame(value)){
        removeNumberFromGame(value);
    } else {
        addNumberToGame(value);
    }

    render();
}
// Renderização de botões
function renderButtons(){
    var divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';
    
    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);
    
}

function createRandomGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Jogo aleatório';

    button.addEventListener('click', randomGame);

    return button;
}

function createNewGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Novo jogo';

    button.addEventListener('click', newGame);

    return button;
}
function createSaveGameButton(){
    var button = document.createElement('button');
    button.textContent = 'Salvar jogo';
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame);

    return button;
}

function renderSavedGames(){
    var divSavedGames = document.querySelector('#megasena-saved-games');
    divSavedGames.innerHTML = '';

    if (state.savedGames.length === 0){
        divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>';
    } else {
        var ulSavedGames = document.createElement('ul')

        for (var i = 0; i < state.savedGames.length; i++){
            var currentGame = state.savedGames[i];

            var liGame = document.createElement('li');
            liGame.textContent = currentGame.join(' - ');

            ulSavedGames.appendChild(liGame)
        }
        divSavedGames.appendChild(ulSavedGames);
    }
};

// Validação addNumber
function addNumberToGame(numberToAdd) {
    if (numberToAdd < 1 || numberToAdd > 60) {
        console.error('Número Inválido', numberToAdd);
        return;
    }

    if (state.currentGame.length >= 6){
        console.error('O jogo já está completo');
        return;
    }

    if (isNumberInGame(numberToAdd)){
        console.error('Este número já está no jogo.', numberToAdd);
        return;
    }

    state.currentGame.push(numberToAdd);
} // Final da validação addnumber

// Verificação de remoção de números
function removeNumberFromGame(numberToRemove){
    if (numberToRemove < 1 || numberToRemove > 60) {
        console.error('Número Inválido', numberToRemove);
        return;
    }

    var newGame = []

    for(i = 0; i < state.currentGame.length; i++){
        var curreNumber = state.currentGame[i]

        if (curreNumber === numberToRemove){
            continue;
        }

        newGame.push(curreNumber);
    }

    state.currentGame = newGame;
}// Final verificação de remoção de números

// Verificação de checagem de numeros
function isNumberInGame(numberToCheck){
    // if (state.currentGame.includes(numberToCheck)){
    //    return true; 
    // }
    // return false;

    // REFATORAÇÃO
    return state.currentGame.includes(numberToCheck);
} // Final verificação de checagem de numeros

// Verificação de jogos salvos
function saveGame(){
    if (!isGameComplete()){
        console.error('O jogo não está completo');
        return;
    }
    state.savedGames.push(state.currentGame);
    writeToLocalStorage();
    newGame();

}
// Verificar se o jogo está completo
function isGameComplete(){
    return state.currentGame.length === 6;
}

// Resetar o jogo
function resetGame(){
    state.currentGame = [];
}

function randomGame(){
    resetGame();

    // enquanto o jogo não estiver completo, cria um numero aleatório e inseri
    // em algum momento o jogo vai fica completo e vai sair do while, "vai dar false ele vai sair"
    while(!isGameComplete()){
    var randomNumber = Math.ceil(Math.random() * 60);
    addNumberToGame(randomNumber)
}
    render();
}


start();

