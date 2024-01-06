const path = 'cards.json';
const button = document.getElementById('start');

let selected = [];
let numSelected = 0;
let cardSelected = [];
let score = 0;
let tries = 0;

async function getImages() {
    const response = await fetch(path);
    const data = response.json();
    
    return data;
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
            if (card.classList.contains('remove') || card.classList.contains('rotate')) {
                return;
            }

            const cardName = card.querySelector('img').alt;

            card.classList.toggle('rotate');
            numSelected++;
            selected.push(cardName);
            cardSelected.push(card);
            if (numSelected === 1) {
            } else if (numSelected === 2)
            {
                if (selected[0] === selected[1]) {
                    console.log(selected);
                    setTimeout(() => {
                        cardSelected.forEach(elem => elem.classList.add('remove'));
                        score++;
                        tries++;
                        selected = [];
                        numSelected = 0;
                        cardSelected = [];
                        console.log(score);
                        console.log(tries);
                    }, 600);
                } else {
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
            } else {
                setTimeout(() => {
                    cardSelected.forEach(elem => elem.classList.toggle('rotate'));
                }, 600);
            }
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
}

button.onclick = async () => {
    let images = [];

    try {
        images = await getImages();
    } catch (error) {
        console.error('Rejected:\n', error);
    }
    shuffleCards(images);
    makeCards(images);
}