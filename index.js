const playerMoney = document.getElementsByClassName('player-money')
const dealerMoney = document.getElementsByClassName('dealer-money')
const hitButton = document.getElementById('hit-button')
const standButton = document.getElementById('stand-button')
const dealButton = document.getElementById('deal-button')
const allInButton = document.getElementById('all-in-button')
const doubleDownButton = document.getElementById('double-button')
const betForm = document.getElementById('bet-form')
const playerHand = document.getElementById('player-hand')
const dealerHand = document.getElementById('dealer-hand')
const titleScreen = document.getElementById('title')
const inGameScreen = document.getElementById('in-game')
const winnerDisplay = document.getElementById(`winner-display`)
const paymentForm = document.getElementById('payment-form')
let dealerSum = 0
let playerSum = 0
let deck = []
let stats = []
let cardBack

standButton.addEventListener('click', endGame)
hitButton.addEventListener('click', hit)
dealButton.addEventListener("click", () => startGame())
doubleDownButton.addEventListener("click", doubleDown)
allInButton.addEventListener("click", allIn)
betForm.addEventListener("submit", betMoney)
loadTitleScreen()

function loadTitleScreen(){
    inGameScreen.style.display = "none"
    fetch('http://localhost:3000/stats')
    .then(response => response.json())
    .then(data => {
    stats = data
    updateMoney()
 })
}

function startGame(){
    document.querySelector("body").style.backgroundImage = "url('assets/in-game-background.webp')"
    titleScreen.style.display = "none"
    inGameScreen.style.display = "block"

    fetch('http://localhost:3000/cards')
    .then(response => response.json())
    .then(data => {
        deck = data
        playerDrawCard(deck[randomCardNum()])
        playerDrawCard(deck[randomCardNum()])
        dealerCardBack()
        dealerDrawCard(deck[randomCardNum()])
    })
    .then (() => {
        if(playerSum === 21)
            endGame()
    })
}

function dealerCardBack(){
    cardBack = document.createElement('img')
    cardBack.id = "card-back"
    cardBack.src = "assets/cardback.png"
    dealerHand.appendChild(cardBack)
}

function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

function playerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    playerHand.appendChild(newCard)
    if (card.value === 11)
        newCard.className = "ace"
    calculatePlayerScore(card)
}

function dealerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    dealerHand.appendChild(newCard)
    if (card.value === 11)
        newCard.className = "ace"
    calculateDealerScore(card)
}

function hit(){
    doubleDownButton.style.display = "none"
    if(playerSum < 21) {
        playerDrawCard(deck[randomCardNum()])
        if (playerSum >= 21) {
            endGame()
        }
    }
    else 
        hitButton.style.display = "none"  
}

function doubleDown(){
    playerDrawCard(deck[randomCardNum()])
    stats.dealer_money -= stats.bet
    stats.player_money -= stats.bet
    stats.bet = stats.bet * 2
    patchMoney()
        doubleDownButton.style.display = "none"
        endGame()
}

function endGame() {
    const dealerCardNum = randomCardNum()
    cardBack.src = deck[dealerCardNum].image
    calculateDealerScore(deck[dealerCardNum])
    if(deck[dealerCardNum].value === 11)
        cardBack.className = "ace"
    while (dealerSum < 17 && playerSum < 22) {
        dealerDrawCard(deck[randomCardNum()])
    }
    standButton.style.display = "none"
    hitButton.style.display = "none"
    doubleDownButton.style.display = "none"
    decideWinner()
    setTimeout(resetGame, 4000)

}

function betMoney(event){
    event.preventDefault()
    const bet = parseInt(event.target.children[1].value)
    if(checkBet(bet)) {
        stats.player_money -= bet
        stats.dealer_money -= bet
        stats.bet = bet
        patchMoney()
        betForm.style.display = "none"
        if(!checkBet(bet))
            doubleDownButton.style.display = "none"
    }
    event.target.reset()
}

// function addPayment(event){
//     event.preventDefault()

  
//     }
//     event.target.reset()


function patchMoney(){
    fetch('http://localhost:3000/stats/', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(stats)
    })
    .then(() => updateMoney())
}

function switchScreens(){
    if (titleScreen.style.display === "none")
        titleScreen.style.display = "block"
    else
        titleScreen.style.display = "none"
    if (inGameScreen.style.display === "none")
        inGameScreen.style.display = "block"
    else
        inGameScreen.style.display = "none"
}

function decideWinner(){
    if (dealerSum > playerSum && dealerSum <= 21 || playerSum > 21)
        lose()
    else if (dealerSum > 21 || dealerSum < playerSum)
        win()
    else
        push()
}

function lose(){
    stats.dealer_money += (stats.bet * 2)
    stats.bet = 0
    patchMoney()
    winnerDisplay.textContent = "YOU LOSE"
}

function win(){
    stats.player_money += (stats.bet * 2)
    stats.bet = 0
    patchMoney()
    winnerDisplay.textContent = "YOU WIN"
}

function push(){
    stats.player_money += stats.bet
    stats.dealer_money += stats.bet
    stats.bet = 0
    patchMoney()
    winnerDisplay.textContent = "PUSH"
}

function resetGame(){
    playerSum = 0
    dealerSum = 0
    playerMoney[0].textContent = stats.player_money.toLocaleString()
    dealerMoney[0].textContent = stats.dealer_money.toLocaleString()
    winnerDisplay.innerHTML = ""
    playerHand.innerHTML = ""
    dealerHand.innerHTML = ""
    hitButton.style.display = "inline"
    standButton.style.display = "inline"
    doubleDownButton.style.display = "inline"
    switchScreens()
    document.querySelector("body").style.backgroundImage = "url('assets/title-screen-background.jpeg')"
    betForm.style.display = "block"
}

function checkBet(bet){
    if (stats.bet > 0 && stats.player_money < bet) {
        return false
    }
    else if (!Number.isInteger(bet)){
        alert("You must enter a number!")
        return false
    }
    else if (stats.player_money < bet){
        alert("You don't have enough money!")
        return false
    }
    else if (bet < 0) {
        alert("You must bet a positive amount!")
        return false
    }
    return true
}

function allIn(){
    stats.bet = stats.player_money
    stats.dealer_money -= stats.bet
    stats.player_money -= stats.bet
    patchMoney()
    if(!checkBet(stats.bet))
        doubleDownButton.style.display = "none"
}

function updateMoney(){
    playerMoney[0].textContent = stats.player_money.toLocaleString()
    dealerMoney[0].textContent = stats.dealer_money.toLocaleString()
    playerMoney[1].textContent = stats.player_money.toLocaleString()
    dealerMoney[1].textContent = stats.dealer_money.toLocaleString()
}

function calculatePlayerScore(card){
    playerSum += card.value
    if (Array.from(playerHand.children).find(findAce) && playerSum > 21) {
        Array.from(playerHand.children).find(findAce).className = ""
        playerSum -= 10
    }
}

function calculateDealerScore(card){
    dealerSum += card.value
    if ((Array.from(dealerHand.children).find(findAce) && dealerSum > 21) ||
        (Array.from(dealerHand.children).find(findAce) && dealerSum < playerSum && dealerSum >= 17)){
            Array.from(dealerHand.children).find(findAce).className = ""
            dealerSum -= 10
    }
}

function findAce(card){
    if(card.className === "ace")
        return true
    }

/*
core functions
-don't allow dealer to go negative. if your bet exceeds the amount of money they have, adjust your bet accordingly
-css. game result should pop up in the middle and not go back to title screen until you click a button
-player and dealerSum visible to user

fun additions
-option to sell your assets when you run out of money
-rock paper scissors on a push
-have the cards overlap
-execute the house when you bankrupt them (crosshair click make casino explode)
-
*/

function formatString(event) {
    let inputChar = String.fromCharCode(event.keyCode);
    let code = event.keyCode;
    let allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }
  
    event.target.value = event.target.value.replace(
      /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
      /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
      /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
      /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
      /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
    ).replace(
      /\/\//g, '/' // Prevent entering more than 1 `/`
    );
  }
  
  