const words = [
    'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'LEMON',
    'MOUNTAIN', 'OCEAN', 'STREAM', 'FOREST', 'DESERT',
    'CIRCLE', 'SQUARE', 'TRIANGLE', 'RECTANGLE', 'OVAL',
    'COMPUTER', 'KEYBOARD', 'MOUSE', 'MONITOR', 'PRINTER',
    'JOURNAL', 'PENCIL', 'ERASER', 'RULER', 'COMPASS',
    'PYTHON', 'JAVASCRIPT', 'HTML', 'CSS', 'CODE',
    'DRAGON', 'PHOENIX', 'UNICORN', 'CENTAUR', 'PEGASUS',
    'RAINBOW', 'MOUNTAIN', 'SKYLINE', 'BARRIER', 'FENCE',
    'WINDOWN', 'INSPIRE', 'NURTURE', 'DREAMS', 'BOLD'
];

function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function updateDisplay() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = '';
    
    for (let i = 0; i < gameState.wordToGuess.length; i++) {
        const letter = gameState.wordToGuess[i];
        const letterDisplay = document.createElement('div');
        letterDisplay.className = 'letter';
        letterDisplay.textContent = gameState.guessedLetters.includes(letter) ? letter : '';
        wordDisplay.appendChild(letterDisplay);
    }
}

function updateKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < alphabet.length; i++) {
        const letter = alphabet[i];
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.disabled = gameState.gameOver;
        
        if (gameState.guessedLetters.includes(letter)) {
            if (gameState.wordToGuess.includes(letter)) {
                key.classList.add('correct');
            } else {
                key.classList.add('wrong');
            }
        }
        
        key.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(key);
    }
}

function handleGuess(letter) {
    if (gameState.gameOver || gameState.guessedLetters.includes(letter)) {
        return;
    }
    
    gameState.guessedLetters.push(letter);
    
    if (gameState.wordToGuess.includes(letter)) {
        updateDisplay();
        
        if (!gameState.wordToGuess.split('').some(l => !gameState.guessedLetters.includes(l))) {
            gameOver(true);
        }
    } else {
        gameState.wrongGuesses++;
        updateDisplay();
        
        if (gameState.wrongGuesses >= gameState.maxWrongGuesses) {
            gameOver(false);
        }
    }
    
    updateKeyboard();
    updateStats();
}

function gameOver(isWin) {
    gameState.gameOver = true;
    updateKeyboard();
    
    const messageEl = document.getElementById('message');
    if (isWin) {
        gameState.score += Math.max(0, gameState.maxWrongGuesses - gameState.wrongGuesses) * 100;
        messageEl.textContent = 'Great job! You won!';
        messageEl.className = 'win';
        messageEl.innerHTML += '<br><strong>You win! Score: +' + (Math.max(0, gameState.maxWrongGuesses - gameState.wrongGuesses) * 100) + '</strong>';
    } else {
        messageEl.textContent = 'Too bad! Game over!';
        messageEl.className = 'lose';
        messageEl.innerHTML += '<br><strong>You lose! The word was: ' + gameState.wordToGuess + '</strong>';
    }
}

function updateStats() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('attempts').textContent = gameState.maxWrongGuesses - gameState.wrongGuesses;
}

function startNewGame() {
    gameState.wordToGuess = getRandomWord();
    gameState.guessedLetters = [];
    gameState.wrongGuesses = 0;
    gameState.gameOver = false;
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = '';
    updateDisplay();
    updateKeyboard();
    updateStats();
}

function loadGameState() {
    const savedState = localStorage.getItem('hangmanGameState');
    if (savedState) {
        Object.assign(gameState, JSON.parse(savedState));
    }
}

function saveGameState() {
    localStorage.setItem('hangmanGameState', JSON.stringify(gameState));
}

window.addEventListener('beforeunload', () => {
    saveGameState();
});

document.getElementById('restart-btn').addEventListener('click', startNewGame);

const gameState = {
    instructions: 'Guess the word letter by letter. You have 6 attempts to guess the word.',
    score: 0,
    wordToGuess: '',
    guessedLetters: [],
    wrongGuesses: 0,
    maxWrongGuesses: 6,
    gameOver: false
};

loadGameState();
startNewGame();