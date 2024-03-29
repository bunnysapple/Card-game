const path = 'cards.json';

let lastGame = {
    time: '--',
    score: '--',
    flips: '--',
    numOfQuits: null
};

if (localStorage.getItem('game')) {
    lastGame = JSON.parse(localStorage.getItem('game'));
}

console.log(lastGame);
let selected = [];
let cardSelected = [];
let numSelected = 0;
let timer = 0;
let minutes = 0;
let seconds = 0;
let score = 0;
let tries = 0;
let set = true;

function count() {
    set = false;
    const mins = document.getElementById('mins');
    const secs = document.getElementById('secs');
    const attempts = document.getElementById('tries');
    const scoreP = document.getElementById('score');
    const reset = document.getElementById('reset');
    const home = document.getElementById('home');

    mins.innerHTML = 0;
    secs.innerHTML = 0;
    attempts.innerHTML = 0;
    scoreP.innerHTML = 0;

    timer = setInterval(() => {
        const flippedCards = document.getElementById('card-box').querySelectorAll('.remove').length;
        const numOfCards = document.getElementById('card-box').querySelectorAll('.card').length;


        if (flippedCards === numOfCards) {
            lastGame.time = `${minutes}:${seconds}`;
            lastGame.score = score;
            lastGame.flips = tries;
            localStorage.setItem('game', JSON.stringify(lastGame));
            minutes = 0;
            seconds = 0;
            clearInterval(timer);
            return;
        }
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        mins.innerHTML = minutes;
        secs.innerHTML = seconds;
    }, 1000);
    

    home.onclick = () => {
        const flippedCards = document.getElementById('card-box').querySelectorAll('.remove').length;
        const numOfCards = document.getElementById('card-box').querySelectorAll('.card').length;
        if (numOfCards > flippedCards) {
            lastGame.numOfQuits++;
            minutes = 0;
            seconds = 0;
            tries = 0;
            score = 0;
            localStorage.setItem('game', JSON.stringify(lastGame));
        }
        clearInterval(timer);
        set = true;
        homePage();
        console.log(numOfCards, flippedCards)
    }

    reset.onclick = () => {
        const flippedCards = document.getElementById('card-box').querySelectorAll('.remove').length;
        const numOfCards = document.getElementById('card-box').querySelectorAll('.card').length;
        if (numOfCards > flippedCards) {
            lastGame.numOfQuits++;
            minutes = 0;
            seconds = 0;
            tries = 0;
            score = 0;
            localStorage.setItem('game', JSON.stringify(lastGame))
        }
        clearInterval(timer);
        set = true;
        gamePage();
    }
}

function cardMatch() {
    setTimeout(() => {
        const attempts = document.getElementById('tries');
        const scoreP = document.getElementById('score');

        cardSelected.forEach(elem => elem.classList.add('remove'));
        score++;
        tries++;

        attempts.innerHTML = tries;
        scoreP.innerHTML = score;
        selected = [];
        numSelected = 0;
        cardSelected = [];
    }, 600);
}

function cardMismatch() {
    setTimeout(() => {
        const attempts = document.getElementById('tries');
        const scoreP = document.getElementById('score');

        cardSelected.forEach(elem => elem.classList.toggle('rotate'));
        tries++;

        attempts.innerHTML = tries;
        if (score === 0) {
            scoreP.innerHTML = 0;
        }

        numSelected = 0;
        selected = [];
        cardSelected = [];
    }, 600);
}

function cardClickEvent(card) {
    let shouldTurn = card.classList.contains('remove')
        || card.classList.contains('rotate')
        || numSelected >= 2;

    if (shouldTurn) {
        return;
    }

    const cardName = card.querySelector('img').alt;

    card.classList.toggle('rotate');
    numSelected++;
    selected.push(cardName);
    cardSelected.push(card);

    if (set) {
        count();
    }

    if (numSelected === 1) {
        return;
    } else if (numSelected === 2) {
        if (selected[0] === selected[1]) {
            cardMatch();
        } else {
            cardMismatch();
        }
    } else {
        setTimeout(() => {
            cardSelected.forEach(elem => elem.classList.toggle('rotate'));
        }, 600);
    }
}

function makeCards(images) {
    let box = document.getElementById('card-box');
    box.innerHTML = '';
    score = 0;
    tries = 0;
    cardSelected = [];
    numSelected = 0;
    selected = [];

    for (const image of images) {
        let card = document.createElement('div');
        let front = document.createElement('div');
        let back = document.createElement('div');
        let img = document.createElement('img');

        card.classList.add('card');
        front.classList.add('front');
        back.classList.add('back');
        img.src = image[0];
        img.alt = image[1];

        back.append(img);
        front.innerHTML = '<i class="fa-solid fa-question"></i>';
        card.append(front, back);

        card.onclick = () => {
            cardClickEvent(card);
        }

        box.append(card);
    }
}

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function getImages() {
    const response = await fetch(path);
    const data = response.json();

    return data;
}

async function generateCards() {
    let images = [];

        try {
            images = await getImages();
        } catch (error) {
            console.error('Rejected:\n', error);
        }
        shuffleCards(images);
        makeCards(images);
}

function gamePage() {
    const screen = document.getElementById('screen');
    const cardBox = document.getElementById('card-box');

    const gameScore = document.createElement('div');
    const scores = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const p3 = document.createElement('p');
    const buttons = document.createElement('div');
    const home = document.createElement('button');
    const reset = document.createElement('button');

    gameScore.id = 'game-score';
    scores.id = 'scores';
    p1.id = 'time';
    p2.id = 'attempts';
    p3.id = 'match';
    buttons.id = 'buttons';
    home.id = 'home';
    reset.id = 'reset';

    p1.innerHTML = `Time: <span id="mins">--</span>m : <span id="secs">--</span>s`;
    p2.innerHTML = `Flips: <span id="tries">--</span>`;
    p3.innerHTML = `Score: <span id="score">--</span>`;
    home.innerHTML = `<i class="fa-solid fa-house"></i>`;
    reset.innerHTML = `<i class="fa-solid fa-arrow-rotate-right"></i>`;

    screen.innerHTML = '';
    cardBox.innerHTML = '';

    home.onclick = () => {
        homePage();
    }

    reset.onclick = () => {
        gamePage();
    }

    scores.append(p1, p2, p3);
    buttons.append(home, reset);
    gameScore.append(scores, buttons);
    screen.append(gameScore);

    generateCards();    
}

function homePage() {
    const screen = document.getElementById('screen');
    const cardBox = document.getElementById('card-box');
    const header = document.createElement('header');
    const prompt = document.createElement('div');
    const h1 = document.createElement('h1');
    const h2Prompt = document.createElement('h2');
    const start = document.createElement('button');
    const lastGameBox = document.createElement('div');
    const scoreBox = document.createElement('div');
    const h3 = document.createElement('h3');
    const lastScores = document.createElement('div');
    const lastTime = document.createElement('p');
    const lastScore = document.createElement('p');
    const lastFlips = document.createElement('p'); 
    const quits = document.createElement('p');

    prompt.id = 'prompt';
    start.id = 'start';
    lastGameBox.id = 'last-game';
    lastScores.id = 'lastScores';
    lastTime.id = 'lastTime';
    lastScore.id = 'lastScore';
    lastFlips.id = 'lastFlips';
    scoreBox.id = 'scoreBox';
    h1.innerHTML = 'Card Flip!';
    h2Prompt.innerHTML = 'Start The Game?'
    start.innerHTML = 'Start!';
    h3.innerHTML = 'Last Game Scores:';
    lastTime.innerHTML = 'Time: <span id="dataTime"></span>';
    lastScore.innerHTML = 'Score: <span id="dataScore"></span>';
    lastFlips.innerHTML = 'Flips: <span id="dataFlips"></span>';
    quits.innerHTML = `Quits: <span id="numOfQuits">${lastGame.numOfQuits === null ? "--" : lastGame.numOfQuits}</span>`

    screen.innerHTML = '';
    cardBox.innerHTML = '';

    header.append(h1);
    prompt.append(h2Prompt, start);
    screen.append(header);
    scoreBox.append(h3, lastTime, lastScore, lastFlips, quits);
    lastGameBox.append(prompt, scoreBox);
    cardBox.append(lastGameBox);

    const dataTime = document.getElementById('dataTime');
    const dataScore = document.getElementById('dataScore');
    const dataFlips = document.getElementById('dataFlips');

    console.log(lastGame['time'], lastGame['score'], lastGame['flips']);

    dataTime.innerHTML = lastGame.time;
    dataScore.innerHTML = lastGame.score;
    dataFlips.innerHTML = lastGame.flips;

    start.onclick = () => {
        gamePage();
    }
}

window.onload = () => {
    const lightOrDark = document.getElementById('light-or-dark')
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const body = document.getElementsByTagName('body')[0];

    homePage();

    lightOrDark.onclick = () => {
        sun.classList.toggle('hidden');
        moon.classList.toggle('hidden');
        body.classList.toggle('dark');
    }
}