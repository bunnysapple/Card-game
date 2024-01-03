const path = 'cards.json';
const button = document.getElementById('start');

let click = 0;
let clicked = [];
let clickedCard = [];
let bestKey = sessionStorage.getItem('bestKey');
let lastKey = sessionStorage.getItem('lastKey');

async function getImages() {
    const response = await fetch(path);
    const data = response.json();
    
    return data;
}

function makeCards(images) {
    let box = document.getElementById('card-box');
    box.innerHTML = '';

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

        card.onclick = (e) => {
            console.log(e.target.parentNode.querySelector('img'))
            card.classList.toggle('rotate');
            click++;
            if (click < 2){
                clicked.push(e.target.parentNode.querySelector('img').alt);
                clickedCard.push(e.target.parentNode);
            }
            else {
                if (clicked[0] === clicked[1]) {
                    console.log('hi')
                    clickedCard.forEach(elem => {
                        elem.classList.add('remove');
                        points++;
                    })
                } else {
                    clickedCard.forEach(elem => {
                        elem.classList.toggle('rotate');
                    })
                }
            }
        };
        box.append(card);
    }
}

window.onload = () => {
    const screen = document.getElementById('screen');
    const box = document.getElementById('card-box');

    const lastTry = document.createElement('div');

}

button.onclick = async () => {
    let images = [];

    try {
        images = await getImages();
    } catch (error) {
        console.error('Rejected:\n', error);
    }

    makeCards(images);
}

