const gameBoard = document.getElementById("gameBoard");
const moveBtns = document.querySelectorAll(".move-btn");
const scoreDiv = document.querySelector(".game__score");
const highScoreDiv = document.querySelector(".game__high-score");
const overlay = document.querySelector(".overlay");
const scoreHistory = document.querySelector(".history .score");
const highScoreHistory = document.querySelector(".history .high-score");
const startBtn = document.getElementById("startGame");
const resetHistoryBtn = document.getElementById("resetHistory");
const difficulty = document.getElementById("gameDifficulty");
const colors = document.querySelectorAll(".color");
const gameOverMessage = document.querySelector(".game-over");

// Declaracion de variables
let headPosition;
let tailPosition;
let direction;
let foodPosition;
let snakeBody;
let gameInterval;
let velocity;
let gameOver;
let score;

let highScoreEasy = localStorage.getItem("highScoreEasy") || 0;
let highScoreNormal = localStorage.getItem("highScoreNormal") || 0;
let highScoreHard = localStorage.getItem("highScoreHard") || 0;


function changeDirection(key) {
    // no estoy llendo hacia abajo
    if (key === "ArrowUp" && direction.y == 0) {
        direction.x = 0;
        direction.y = -1;
        direction.name = "up";
    } else if (key === "ArrowDown" && direction.y == 0) {
        direction.x = 0;
        direction.y = 1;
        direction.name = "down";
    } else if (key === "ArrowRight" && direction.x == 0) {
        direction.x = 1;
        direction.y = 0;
        direction.name = "right";
    } else if (key == "ArrowLeft" && direction.x == 0) {
        direction.x = -1;
        direction.y = 0;
        direction.name = "left";
    }
}

function getNewFoodPosition() {
    let x = Math.floor(Math.random() * 20 + 1);
    let y = Math.floor(Math.random() * 20 + 1);

    while (snakeBody.find(piece => piece.x == x && piece.y == y)) {
        x = Math.floor(Math.random() * 20 + 1);
        y = Math.floor(Math.random() * 20 + 1);
    }

    foodPosition.x = x;
    foodPosition.y = y;
}

function generateFood() {
    const food = document.createElement('div');
    food.classList.add("food");
    food.style.setProperty('grid-area', `${foodPosition.y
        } / ${foodPosition.x}`);
    gameBoard.appendChild(food);
    console.log(food);
}

function generateSnake() {

    for (let i = 0; i < snakeBody.length; i++) {
        const piece = document.createElement('div');
        piece.classList.add("snake");
        piece.style.setProperty('grid-area', `${snakeBody[i].y}/${snakeBody[i].x}`);

        if (i == 0) {
            piece.classList.add(`head-${headPosition.direction}`)
        } else if (i == snakeBody.length - 1) {
            piece.classList.add(`tail-${tailPosition.direction}`)
        }

        gameBoard.appendChild(piece);
        console.log(piece);
    }
}

function handleGameOver(message) {
    gameOver = true;
    clearInterval(gameInterval);
    overlay.classList.remove("closed");
    startBtn.innerText = "PLAY AGAIN";
    scoreHistory.classList.add("show");
    gameOverMessage.innerText = message;
    scoreHistory.firstChild.innerText = `${score}`;
    highScoreHistory.firstChild.innerText = `${getHighScore()}`;
}

function getHighScore() {
    if (velocity == 300) {
        highScoreEasy = (score > highScoreEasy) ? score : highScoreEasy;
        localStorage.setItem("highScoreEasy", highScoreEasy);
        return highScoreEasy;
    } else if (velocity == 200) {
        highScoreNormal = (score > highScoreNormal) ? score : highScoreNormal;
        localStorage.setItem("highScoreNormal", highScoreNormal);
        return highScoreNormal;
    } else if (velocity == 100) {
        highScoreHard = (score > highScoreHard) ? score : highScoreHard;
        localStorage.setItem("highScoreHard", highScoreHard);
        return highScoreHard;
    }
}

function resetHighScore() {
    if (velocity == 300) {
        highScoreEasy = 0;
        localStorage.setItem("highScoreEasy", highScoreEasy);
    } else if (velocity == 200) {
        highScoreNormal = 0;
        localStorage.setItem("highScoreNormal", highScoreNormal);
    } else if (velocity == 100) {
        highScoreHard = 0;
        localStorage.setItem("highScoreHard", highScoreHard);
    }
}

function initGame() {
    if (!gameOver) {

        gameBoard.innerHTML = '';

        generateFood();

        // Actualizar posicion y dirección de la cabeza
        headPosition.x += direction.x;
        headPosition.y += direction.y;
        headPosition.direction = direction.name;

        // Desplazar el arreglo de la serpiente
        snakeBody.pop();
        snakeBody.unshift({ x: headPosition.x, y: headPosition.y, direction: headPosition.direction });

        // Actualizar posicion y dirección de la cola
        tailPosition.y = snakeBody[snakeBody.length - 1].y;
        tailPosition.x = snakeBody[snakeBody.length - 1].x;
        tailPosition.direction = snakeBody[snakeBody.length - 2].direction;

        // Si la serpiente choca con la comida
        if (headPosition.x == foodPosition.x && headPosition.y == foodPosition.y) {
            score++;
            scoreDiv.innerText = `Score: ${score}`;
            highScoreDiv.innerText = `Hight Score: ${getHighScore()}`;

            // Agregar nuevo elemento al final del arreglo
            snakeBody.push({ x: tailPosition.x, y: tailPosition.y, d: tailPosition.d });

            // Generar nueva posicicon para la comida
            getNewFoodPosition();
        }

        // Si la serpiente choca con los limites
        if (headPosition.x > 20 || headPosition.y > 20 || headPosition.x <= 0 || headPosition.y <= 0) {
            handleGameOver("Game Over! You have collided with the board limits.");
        }

        // Si la serpiente choca consigo misma
        for (let i = 1; i <= snakeBody.length - 1; i++) {
            if (headPosition.x == snakeBody[i].x && headPosition.y == snakeBody[i].y) {
                handleGameOver("Game Over! You have collided with your body.");
            }
        }

        generateSnake();
    };
}

startBtn.addEventListener("click", () => {
    headPosition = { x: 5, y: 5, direction: "right" };
    tailPosition = { x: 3, y: 5, direction: "right" };
    direction = { x: 1, y: 0, name: "right" };
    foodPosition = { x: 9, y: 15 };
    snakeBody = [
        { x: 5, y: 5, direction: "right" },
        { x: 4, y: 5, direction: "right" },
        { x: 3, y: 5, direction: "right" }];
    getNewFoodPosition();
    score = 0;
    gameOver = false;
    overlay.classList.add("closed");
    gameBoard.innerHTML = "";
    scoreDiv.innerText = `Score: ${score}`;
    highScoreDiv.innerText = `High Score: ${getHighScore()}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(initGame, velocity);
});

resetHistoryBtn.addEventListener("click", () => {
    score = 0;
    velocity = difficulty.value;
    scoreHistory.classList.remove("show");
    resetHighScore();
    highScoreHistory.firstChild.innerText = `${getHighScore()}`;
    gameOverMessage.innerText = "";
});

difficulty.addEventListener("change", () => {
    score = 0;
    velocity = difficulty.value;
    scoreHistory.classList.remove("show");
    highScoreHistory.firstChild.innerText = `${getHighScore()}`;
    gameOverMessage.innerText = "";
});

colors.forEach((color) => {
    color.addEventListener("click", (e) => {
        var selectedColor = e.target.dataset.hex;
        document.documentElement.style.setProperty('--snake-color', `${selectedColor}`);
        colors.forEach(c => { c.classList.remove("selected") });
        color.classList.add("selected");
    })
})

document.addEventListener("keydown", (e) => {
    changeDirection(e.key);
});

moveBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const key = e.target.getAttribute("id");
        changeDirection(key);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    score = 0;
    velocity = difficulty.value;
    highScoreHistory.firstChild.innerText = `${getHighScore()}`;
})