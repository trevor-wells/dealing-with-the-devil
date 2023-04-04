let dealerSum = 0;
let playerSum = 0;
let deck = []
let stats = []

const dealerCard1 = document.getElementById('dealer-card-1');
const dealerCard2 = document.getElementById('dealer-card-2');
const playerCard1 = document.getElementById('player-card-1');
const playerCard2 = document.getElementById('player-card-2');
const playerMoney = document.getElementById('player-money');
const dealerMoney = document.getElementById('dealer-money');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealButton = document.getElementById('deal-button');
const allInButton = document.getElementById('all-in-button');
const doubleDownButton = document.getElementById('double-button');
const betForm = document.getElementById('bet-form');
const bank = document.getElementById('bank');
const cardDeck = document.getElementById('card-deck');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const titleScreen = document.getElementById('title')
const inGameScreen = document.getElementById('in-game')


standButton.addEventListener('click', endGame)
hitButton.addEventListener('click', hit)
dealButton.addEventListener("click", () => window.location.reload());
doubleDownButton.addEventListener("click", () => doubleDown());
betForm.addEventListener("submit", betMoney);

fetch('http://localhost:3000/cards')
 .then(response => response.json())
 .then(data => {
    deck = data
    console.log(deck)
    getStartingHand(data)
 })

 fetch('http://localhost:3000/stats')
 .then(response => response.json())
 .then(data => {
    stats = data
    playerMoney.textContent = data.player_money
    dealerMoney.textContent = data.dealer_money
 })

function getStartingHand(cards){
    titleScreen.style.display = "none"
    const dealerNum = randomCardNum()
    const playerNum1 = randomCardNum()
    const playerNum2 = randomCardNum()
    
    dealerCard1.src = cards[dealerNum].image
    dealerCard2.src = "assets/cardback.jpeg"
    dealerSum += cards[dealerNum].value

    playerCard1.src = cards[playerNum1].image
    playerCard2.src = cards[playerNum2].image
    playerSum += cards[playerNum1].value + cards[playerNum2].value
}

function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

function playerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    playerSum += card.value
    playerHand.appendChild(newCard)
}

function dealerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    dealerSum += card.value
    dealerHand.appendChild(newCard)
}

function hit(){
    if(playerSum < 21) {
        playerDrawCard(deck[randomCardNum()])
        if (playerSum > 21) {
            const dealerNum2 = randomCardNum()
            dealerCard2.src = deck[dealerNum2].image
            dealerSum += deck[dealerNum2].value
            endGame()
        }
    }
    else 
        hitButton.disabled = true;
}

function endGame() {
    const dealerNum2 = randomCardNum()
    dealerCard2.src = deck[dealerNum2].image
    dealerSum += deck[dealerNum2].value
    while (dealerSum < 17)
        dealerDrawCard(deck[randomCardNum()])
    standButton.disabled = true;
    hitButton.disabled = true;
    if (dealerSum > playerSum || playerSum > 21)
        lose()
    else if (dealerSum > 21 || dealerSum < playerSum)
        win()
    else
        push()
    inGameScreen.style.display = "none"
    titleScreen.style.display = "block"
}

function lose(){
    const loseMessage = document.createElement("h1")
    loseMessage.textContent = "YOU LOSE"
    document.querySelector("#player").append(loseMessage)
}

function win(){
    const winMessage = document.createElement("h1")
    winMessage.textContent = "YOU WIN"
    document.querySelector("#player").append(winMessage)
}

function push(){
    const pushMessage = document.createElement("h1")
    pushMessage.textContent = "PUSH!"
    document.querySelector("#player").append(pushMessage)
}
function doubleDown(){
    playerDrawCard(deck[randomCardNum()])
    doubleDownButton.style.display = "none"
    endGame()
}
function betMoney(event){
    event.preventDefault()
    const bet = parseInt(event.target.children[1].value)
    if (bet > stats.player_money) {
        alert("You cannot bet more money than you have!")
        event.target.reset()
        return
    }
    stats.player_money = stats.player_money - bet
    stats.dealer_money = stats.dealer_money - bet
    playerMoney.textContent = stats.player_money
    event.target.reset();
    patchMoney()
}

function patchMoney(){
    fetch('http://localhost:3000/stats/', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "player_money": stats.player_money,
            "dealer_money": stats.dealer_money
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
}
