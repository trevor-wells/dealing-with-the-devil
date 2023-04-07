//GLOBAL VARIABLE DECLARATIONS
const playerMoney = document.getElementsByClassName('player-money')
const dealerMoney = document.getElementsByClassName('dealer-money')
const hitButton = document.getElementById('hit-button')
const standButton = document.getElementById('stand-button')
const dealButton = document.getElementById('deal-button')
const allInButton = document.getElementById('all-in-button')
const doubleDownButton = document.getElementById('double-button')
const fullScreenButton = document.getElementById('full-screen-button')
const playAgainButton = document.getElementById('play-again-button')
const betForm = document.getElementById('bet-form')
const playerHand = document.getElementById('player-hand')
const dealerHand = document.getElementById('dealer-hand')
const titleScreen = document.getElementById('title-screen')
const inGameScreen = document.getElementById('in-game-screen')
const losingScreen = document.getElementById('losing-screen')
const winnerDisplay = document.getElementById(`winner-display`)
const loserDisplay = document.getElementById(`loser-display`)
const pushDisplay = document.getElementById(`push-display`)
const paymentForm = document.getElementById('payment-form')
const background = document.querySelector("html")
const assetsDiv = document.getElementById("assets-div")
const miniGame = document.getElementById("mini-game")

let globalAssets
let dealerSum = 0
let playerSum = 0
let deck = []
let globalStats = []
let cardBack
let globalBet;


//AUDIO VARIABLES
const titleMusic = new Audio('assets/title-music.mp3')
const inGameMusic = new Audio('assets/in-game-music.mp3')
const loseMusic = new Audio('assets/lose-music.mp3')
const winMusic = new Audio('assets/win-music.mp3')

//EVENT LISTENERS
paymentForm.addEventListener('submit', formatPaymentInfo)
dealButton.addEventListener("click", loadGameScreen)
allInButton.addEventListener("click", allIn)
betForm.addEventListener("submit", betMoney)
standButton.addEventListener('click', endGame)
hitButton.addEventListener('click', hit)
doubleDownButton.addEventListener("click", doubleDown)
// playAgainButton.addEventListener("click", playAgain)



//SCREEN SWITCH FUNCTIONS
loadTitleScreen()
fetchAssets()
assetsDiv.style.display = "none"
function loadTitleScreen(){
    inGameScreen.style.display = "none"
    paymentForm.style.display = "none"
    inGameMusic.pause()
    titleMusic.play()


    fetch('http://localhost:3000/stats')
    .then(response => response.json())
    .then(data => {
    globalStats = data
    updateMoney()
    })
}

function fetchAssets(){
    fetch('http://localhost:3000/assets')
    .then(response => response.json())
    .then(data => {
        globalAssets = data
        assetsDiv.innerHTML = ""
        data.forEach(createAsset)
    })
}

function createAsset(asset){
    if(asset.owned){
        const myFig = document.createElement('fig')
        const myImg = document.createElement('img')
        const myFigCap = document.createElement('figcaption')
        myImg.src = asset.image
        myImg.id = asset.id
        myImg.className = "asset"
        myImg.addEventListener("click" , sellAsset)
        myFigCap.textContent = asset.name
        myFig.append(myImg,myFigCap)
        assetsDiv.append(myFig)
    }
}

function sellAsset(event){
    const asset = event.target
    globalStats.player_money += globalAssets[asset.id].value
    globalAssets[asset.id].owned = false
    patchMoney()
    patchAssets(event.target.id)
    setTimeout(fetchAssets , 10)
}

function patchAssets(id){
    fetch(`http://localhost:3000/assets/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(globalAssets[id])
    })
}

function loadGameScreen(){
    inGameScreen.style.color = "white"
    titleMusic.pause()
    inGameMusic.play()
    background.style.backgroundImage = "url('assets/in-game-background.webp')"
    titleScreen.style.display = "none"
    inGameScreen.style.display = "grid"
    assetsDiv.style.display = "none"

    fetch('http://localhost:3000/cards')
    .then(response => response.json())
    .then(data => {
        deck = data
        playerDrawCard(deck[randomCardNum()])
        playerDrawCard(deck[randomCardNum()])
        cardBack = document.createElement('img')
        cardBack.id = "card-back"
        cardBack.className = "card"
        cardBack.src = "assets/cardback.png"
        dealerHand.appendChild(cardBack)
        dealerDrawCard(deck[randomCardNum()])
        // miniGame.appendChild(cardBack)
        
    })
    .then (() => {
        if(playerSum === 21)
            endGame()
    })
}

function decideOutcome(){
    if(globalStats.player_money === 0){
        if(Array.from(globalAssets).find(checkOwned)){
            loadTitleScreen()
            return true
        }
        else {
            loadLoseScreen()
            return false
        }
    }
    else if (globalStats.dealer_money === 0){
        loadWinScreen()
        return false
    }
    assetsDiv.style.display = "none"
    return true
}

function checkOwned(asset){
    return asset.owned
}
function loadWinScreen(){
    background.style.backgroundImage = "url('assets/win-screen-background.jpeg')"
    inGameScreen.style.display = "none"
    inGameMusic.pause()
    winMusic.play()
    // winnerText.textContent = "YOU MADE IT TO HEAVEN!"
    
}

function loadLoseScreen(){
    background.style.backgroundImage = "url('assets/lose-screen-background.jpeg')"
    inGameScreen.style.display = "none"
    paymentForm.style.display = "grid"
    inGameMusic.pause()
    loseMusic.play()
 
}

// function loadResultScreen(){
//     background.style.backgroundImage = "url('assets/result-screen.jpeg')"
//     inGameScreen.style.display = "none"
//     paymentForm.style.display = "none"
// }

function switchScreens(){
    if (titleScreen.style.display === "none")
        titleScreen.style.display = "grid"
    else
        titleScreen.style.display = "none"
    if (inGameScreen.style.display === "none")
        inGameScreen.style.display = "grid"
    else
        inGameScreen.style.display = "none"
}



//TITLE SCREEN FUNCTIONS
function betMoney(event){
    event.preventDefault()
    const myBet = parseInt(event.target.children[1].value)
    if(checkBet(myBet)) {
        globalStats.player_money -= myBet
        globalStats.dealer_money -= myBet
        globalStats.bet = myBet
        patchMoney()
        betForm.style.display = "none"
        allInButton.style.display = "none"
        if(!checkBet(myBet))
            doubleDownButton.style.display = "none"
    }
    event.target.reset()
}

function checkBet(bet){
    if ((globalStats.bet > 0 && globalStats.player_money < bet) ||
        (bet > globalStats.dealer_money && globalStats.bet > 0)) {
        return false
    }
    else if (bet > globalStats.dealer_money) {
        alert("Dealer is too poor to bet!")
        return false
    }
    else if (!Number.isInteger(bet)){
        alert("You must enter a number!")
        return false
    }
    else if (globalStats.player_money < bet){
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
    if(checkBet(globalStats.player_money)){
        globalStats.bet = globalStats.player_money
        globalStats.dealer_money -= globalStats.bet
        globalStats.player_money -= globalStats.bet
        patchMoney()
        allInButton.style.display = "none"
        doubleDownButton.style.display = "none"
        betForm.style.display = "none"
    }
}

function patchMoney(){
    fetch('http://localhost:3000/stats/', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(globalStats)
    })
    .then(() => updateMoney())
}

function updateMoney(){
    playerMoney[0].textContent = globalStats.player_money.toLocaleString()
    dealerMoney[0].textContent = globalStats.dealer_money.toLocaleString()
    playerMoney[1].textContent = globalStats.player_money.toLocaleString()
    dealerMoney[1].textContent = globalStats.dealer_money.toLocaleString()
}



//IN GAME FUNCTIONS
function endGame() {
    const dealerCardNum = randomCardNum()
    cardBack.src = deck[dealerCardNum].image
    calculateDealerScore(deck[dealerCardNum])
    if(deck[dealerCardNum].value === 11)
        cardBack.className = "ace card"
    while (dealerSum < 17 && playerSum < 22 && dealerSum <= playerSum) {
        dealerDrawCard(deck[randomCardNum()])
    }
    standButton.style.display = "none"
    hitButton.style.display = "none"
    doubleDownButton.style.display = "none"
    assetsDiv.style.display = "flex"
    decideWinner()
    if(decideOutcome())
        setTimeout(resetGame, 4500)
}

function resetGame(){
    playerSum = 0
    dealerSum = 0
    playerMoney[0].textContent = globalStats.player_money.toLocaleString()
    dealerMoney[0].textContent = globalStats.dealer_money.toLocaleString()
    winnerDisplay.innerHTML = ""
    loserDisplay.innerHTML = ""
    pushDisplay.innerHTML = ""
    playerHand.innerHTML = ""
    dealerHand.innerHTML = ""
    hitButton.style.display = "inline"
    standButton.style.display = "inline"
    doubleDownButton.style.display = "inline"
    background.style.backgroundImage = "url('assets/title-screen-background.jpeg')"
    allInButton.style.display = "grid"
    betForm.style.display = "grid"
    titleScreen.style.display = "grid"
    loadTitleScreen()
}

function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

function playerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    newCard.className = "card"
    playerHand.appendChild(newCard)
    if (card.value === 11)
        newCard.className = "ace card"
    calculatePlayerScore(card)
}

function dealerDrawCard(card){
    const newCard = document.createElement('img')
    newCard.src = card.image
    newCard.className = "card"
    dealerHand.appendChild(newCard)
    if (card.value === 11)
        newCard.className = "ace card"
    calculateDealerScore(card)
}

function findAce(card){
    if(card.className === "ace card")
        return true
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
    globalStats.dealer_money -= globalStats.bet
    globalStats.player_money -= globalStats.bet
    globalStats.bet = globalStats.bet * 2
    patchMoney()
        doubleDownButton.style.display = "none"
        endGame()
}

function calculatePlayerScore(card){
    playerSum += card.value
    if (Array.from(playerHand.children).find(findAce) && playerSum > 21) {
        Array.from(playerHand.children).find(findAce).className = "card"
        playerSum -= 10
    }
}

function calculateDealerScore(card){
    dealerSum += card.value
    if ((Array.from(dealerHand.children).find(findAce) && dealerSum > 21) ||
        (Array.from(dealerHand.children).find(findAce) && dealerSum < playerSum && dealerSum >= 17)){
            Array.from(dealerHand.children).find(findAce).className = "card"
            dealerSum -= 10
    }
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
    globalStats.dealer_money += (globalStats.bet * 2)
    globalStats.bet = 0
    patchMoney()
    loserDisplay.textContent = "YOU LOSE"
    winnerDisplay.innerHTML = ""
    pushDisplay.innerHTML = ""
    // loadResultScreen()
}

function win(){
    globalStats.player_money += (globalStats.bet * 2)
    globalStats.bet = 0
    patchMoney()
    winnerDisplay.textContent = "YOU WIN"
    loserDisplay.innerHTML = ""
    pushDisplay.innerHTML = ""
    // loadResultScreen()
}

function push(){
    globalStats.player_money += globalStats.bet
    globalStats.dealer_money += globalStats.bet
    globalStats.bet = 0
    patchMoney()
    pushDisplay.textContent = "PUSH"
    winnerDisplay.innerHTML = ""
    loserDisplay.innerHTML = ""
    // miniGame()
}

// function miniGame(){
//     loadResultScreen()
//     const newCard = document.createElement('img')
//     newCard.src = card.image
//     newCard.className = "card"
//     miniGame.appendChild(newCard)
//     if (card.value === 11)
//         newCard.className = "ace card"

// }


//HTML FUNCTIONS
function formatDate(event) {
    String.fromCharCode(event.keyCode);
    let code = event.keyCode;
    let allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }
    event.target.value = event.target.value.replace(
      /^([1-9]\/|[2-9])$/g, '0$1/'
    ).replace(
      /^([0-1])([3-9])$/g, '0$1/$2' 
    ).replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' 
    ).replace(
      /^(0[1-9]|1[0-2])$/g, '$1/' 
    ).replace(
      /[^\d\/]|^[\/]*$/g, '' 
    );
  }

  function formatPaymentInfoKey(event) {
    let code = (event.which) ? event.which : event.keyCode;
    if(code != 8)
        formatPaymentInfo();
    else{
        document.getElementById("payment-input").value = document.getElementById("payment-input").value.replace(/\s+$/, '');
    }

}
  function formatPaymentInfo() {
    let cardField = document.getElementById("payment-input");
    let realNumber = cardField.value.replace(/\D/g,'');
    let newNumber = "";
    for(let i = 1; i <= realNumber.length; i++){
        if (isNumber(realNumber.charAt(i-1)))
            newNumber += realNumber.charAt(i-1);
        if(i % 4 == 0 && i > 0 && i < 15)
            newNumber += " ";
    }
    cardField.value = newNumber;
}

function isNumber(char){
    return('0123456789'.indexOf(char) !== -1);
}

function getFullscreenElement(){
    return document.fullscreenElement
}
function toggleFullscreen(){
    if(getFullscreenElement()){
        document.exitFullscreen();
    }
    else{
        document.documentElement.requestFullscreen().catch(console.log)
    }
}
fullScreenButton.addEventListener('dblclick', () => {toggleFullscreen()})

// This is not even entirely comprehensive. There's more.
//TO - DO LIST
    /*
    core functions
    -css. game result should pop up in the middle and not go back to title screen until you click a button
    -player and dealerSum visible to user

    fun additions
    -option to sell your assets when you run out of money
    -rock paper scissors on a push
    -have the cards overlap
    -execute the house when you bankrupt them (crosshair click make casino explode)
    -
    */
