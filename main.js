const path = 'cards.json';
const button = document.getElementById('start');

let lastGame = [];
if (localStorage.getItem('game')) {
    lastGame = JSON.parse(localStorage.getItem('game'));
}
console.log(lastGame);
let game = [];
let selected = [];
let cardSelected = [];
let numSelected = 0;
let time = 0;
let score = 0;
let tries = 0;
let set = true;

async function getImages() {
    const response = await fetch(path);
    const data = response.json();

    return data;
}

function firstPage() {
    const screen = document.getElementById('screen');
    const cardBox = document.getElementById('card-box');
    const header = document.createElement('header');
    const prompt = document.createElement('div');
    const h2Header = document.createElement('h2');
    const h2Prompt = document.createElement('h2');
    const start = document.createElement('button');

    prompt.id = 'prompt';
    start.id = 'start';
    h2Header.innerHTML = 'Card Flip!';
    h2Prompt.innerHTML = 'Start The Game?'
    start.innerHTML = 'Start!';

    header.append(h2Header);
    prompt.append(h2Prompt, start);
    screen.append(header, prompt);

    start.onclick = async () => {
        let images = [];

        try {
            images = await getImages();
        } catch (error) {
            console.error('Rejected:\n', error);
        }
        //shuffleCards(images);
        makeCards(images);
    }
}

function count() {
    set = false;
    
    let timer = setInterval(() => {
        time = Math.round((time + 0.01) * 100) / 100;

        const flippedCards = document.getElementById('card-box')
                            .querySelectorAll('.remove').length;
        const numOfCards = document.getElementById('card-box')
                            .querySelectorAll('.card').length;
        console.log(time);

        if (flippedCards === numOfCards) {
            console.log('hi');
            console.log(time);
            clearInterval(timer);
        }
    }, 10);
}

function cardMatch() {
    setTimeout(() => {
        cardSelected.forEach(elem => elem.classList.add('remove'));
        score++;
        tries++;
        selected = [];
        numSelected = 0;
        cardSelected = [];
    }, 600);
}

function cardMismatch() {
    setTimeout(() => {
        cardSelected.forEach(elem => elem.classList.toggle('rotate'));
        tries++;
        numSelected = 0;
        selected = [];
        cardSelected = [];
        console.log(score);
        console.log(tries);
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

window.onload = () => {
    firstPage();
}

/* button.onclick = async () => {
    let images = [];

    try {
        images = await getImages();
    } catch (error) {
        console.error('Rejected:\n', error);
    }
    shuffleCards(images);
    makeCards(images);
} */