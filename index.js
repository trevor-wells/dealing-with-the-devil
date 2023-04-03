let currentCard;

let dealerSum = 0;
let playerSum = 0;
let dealerHand = [];
let playerHand = [];
let hidden;

const dealerCard1 = document.getElementById('dealer-card-1');
const dealerCard2 = document.getElementById('dealer-card-2');
const playerCard1 = document.getElementById('player-card-1');
const playerCard2 = document.getElementById('player-card-2');
const playerScore = document.getElementById('player-score');
const dealerScore = document.getElementById('dealer-score');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealButton = document.getElementById('deal-button');
const allInButton = document.getElementById('all-in-button');
const bank = document.getElementById('bank');
const cardDeck = document.getElementById('card-deck');



// function deckOfCards(){
//     let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
//     let suits = ["S", "D", "C", "H"]
// }


function getStartingHand(cards){
    dealerCard1.src = cards[randomCardNum()].image
    dealerCard2.src = "assets/card-back.png"
    playerCard1.src = cards[randomCardNum()].image
    playerCard2.src = cards[randomCardNum()].image
}

function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

function showCards(card){
    //shows the cards on the page
    dealerCard1.textContent = card.value;
    dealerCard2.textContent = card.value;
    playerCard1.textContent = card.value;
    playerCard2.textContent = card.value;
}

fetch('http://localhost:3000/cards')
 .then(response => response.json())
 .then(data => {
    getStartingHand(data)
 })

//junktext