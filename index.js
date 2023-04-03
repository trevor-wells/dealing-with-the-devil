let dealerSum = 0;
let playerSum = 0;

function deckOfCards(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let suits = ["S", "D", "C", "H"]
}



function newGame(){
    
}

function hit(){}

function stand(){}

function deal(){}

function dealerHand(){}

function playerHand(){}

function showCards(){}

function showDealerHand(){}

function showPlayerHand(){}

function showDealerSum(){}

function showPlayerSum(){}

function showResult(){}

function reset(){}

function resetDealer(){}

function resetPlayer(){}

function resetDealerSum(){}

function resetPlayerSum(){}

function resetResult(){}









fetch('https://deckofcardsapi.com/')
 .then(response => response.json())
 .then(data => console.log(data))


 function shuffleCards() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(cards => console.log(cards))
 }