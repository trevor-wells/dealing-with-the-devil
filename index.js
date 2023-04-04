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
    console.log(dealerMoney)
    updateMoney()
 })
}

function startGame(){
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
    cardBack.src = "assets/cardback.jpeg"
    dealerHand.appendChild(cardBack)
}

function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

function playerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    playerSum += card.value
    playerHand.appendChild(newCard)

    if (card.value === 11)
        newCard.className = "ace"
}

function dealerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    dealerSum += card.value
    dealerHand.appendChild(newCard)

    if (card.value === 11)
        newCard.className = "ace"
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
    stats.dealer_money -= stats.bet;
    stats.player_money -= stats.bet;
    stats.bet = stats.bet * 2
    patchMoney()
        doubleDownButton.style.display = "none"
        endGame()
}

function endGame() {
    const dealerCardNum = randomCardNum()
    cardBack.src = deck[dealerCardNum].image
    dealerSum += deck[dealerCardNum].value
    if(deck[dealerCardNum].value === 11)
        cardBack.className = "ace"
    while (dealerSum < 17 && playerSum < 22)
        dealerDrawCard(deck[randomCardNum()])
    standButton.style.display = "none"
    hitButton.style.display = "none"
    doubleDownButton.style.display = "none"
    decideWinner()
    setTimeout(resetGame, 3000)

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

function patchMoney(){
    fetch('http://localhost:3000/stats/', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(stats)
    })
    .then(updateMoney())
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
    stats.player_money += (stats.bet * 2),
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
    betForm.style.display = "block"
}

function checkBet(bet){
    console.log(typeof bet)
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
    stats.player_money -= stats.bet;
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

// function calculateScore(card){
//     playerSum += card.value
//     // check to see if player hand has ACE
//     // add 11 to player sum if playerSum < 21
//     // if not, add 1 to player sum
//     // if playerSum > dealerSum, and dealerSum has an ACE that is 17 or less then Dealer draws a card

//     if (playerSum > 21 && playerHand.children)
//         playerSum -= 10
//     else if (dealerSum < 17)
//         playerSum += 11
//     else if (dealerSum > 22)
//         playerSum += 1
// }

// function sellAssets(){
//     if (stats.player_money <= 0) {
//         alert("You have no money to sell!")
//     }
// }