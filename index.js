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



function deckOfCards(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let suits = ["S", "D", "C", "H"]
}

function showCards(card){
    //shows the cards on the page
    dealerCard1.textContent = card.value;
    dealerCard2.textContent = card.value;
    playerCard1.textContent = card.value;
    playerCard2.textContent = card.value;
}

function newGame(){
    //when the game is over option for new game button is clicked
}

function hit(){
    //if player has 2 or more cards in hand that are below 21 then draw card (optional)
    if (playerSum < 21){
        drawCard();
    }
}

function drawCard(){
    //will draw a random card from the deck
}

function stand(){
    //no cards are delt and the dealer shows the cards and proceeds with the game
}

function deal(){}

function dealerHand(){
    //shows the value of the dealer's hand 
}

function playerHand(){
    //shows the value of the player's hand
}

function showDealerHiddenCard(){
    //shows the value of the dealer's hidden card
}

function showDealerSum(){
    //show the money of the dealer
}

function showPlayerSum(){
    //show the money of the player
}

function showResult(){
    //shows the result of the game
}

function reset(){
    //resets the game
}

function resetDealer(){
    //resets the money of the dealer to 10,0000
}

function resetPlayer(){
    //resets the money of the player to 1,000
}

function resetResult(){
    //resets the result of the game to 0
}

function sellingAssets(){
    //if player has 0 money left player is able to sell their assets for money depending on the value of the asset
}


// fetch('http://localhost:3000/cards')
//  .then(response => response.json())
//  .then(data => console.log(data))


//  function newDeck() {
//     fetch("http://localhost:3000/cards")
//     .then(response => response.json())
//     .then(cards => console.log(cards))
//  }