//GLOBAL VARIABLE DECLARATIONS
const playerMoney = document.getElementsByClassName('player-money')
const dealerMoney = document.getElementsByClassName('dealer-money')
const playerHand = document.getElementById('player-hand')
const dealerHand = document.getElementById('dealer-hand')
const betForm = document.getElementById('bet-form')
const background = document.querySelector("html")
const titleScreen = document.getElementById('title-screen')
const inGameScreen = document.getElementById('in-game-screen')
const losingScreen = document.getElementById('losing-screen')
const winningScreen = document.getElementById("winning-screen")
const winnerDisplay = document.getElementById(`winner-display`)
const loserDisplay = document.getElementById(`loser-display`)
const pushDisplay = document.getElementById(`push-display`)
const hitButton = document.getElementById('hit-button')
const standButton = document.getElementById('stand-button')
const dealButton = document.getElementById('deal-button')
const allInButton = document.getElementById('all-in-button')
const doubleDownButton = document.getElementById('double-button')
const fullScreenButton = document.getElementById('full-screen-button')
const playAgainButton1 = document.getElementById("play-again-button1")
const playAgainButton2 = document.getElementById("play-again-button2")
const assetsDiv = document.getElementById("assets-div")
const paymentForm = document.getElementById('payment-form')
const paymentDiv = document.getElementById("payment-div")

let globalBet
let globalAssets
let cardBack
let dealerSum = 0
let playerSum = 0
let deck = []
let globalStats = []



//AUDIO VARIABLES
const titleMusic = new Audio('resources/music/title-music.mp3')
const inGameMusic = new Audio('resources/music/in-game-music.mp3')
const loseMusic = new Audio('resources/music/lose-music.mp3')
const winMusic = new Audio('resources/music/win-music.mp3')
titleMusic.loop = true
inGameMusic.loop = true
loseMusic.loop = true
winMusic.loop = true



//EVENT LISTENERS
betForm.addEventListener("submit", betMoney)
paymentForm.addEventListener('submit', formatPaymentInfo)
paymentForm.addEventListener('submit', stealBankAccount)
dealButton.addEventListener("click", loadGameScreen)
allInButton.addEventListener("click", allIn)
standButton.addEventListener('click', endGame)
hitButton.addEventListener('click', hit)
doubleDownButton.addEventListener("click", doubleDown)
playAgainButton1.addEventListener("click", playAgain)
playAgainButton2.addEventListener("click", playAgain)



//SCREEN SWITCH FUNCTIONS
loadTitleScreen()
assetsDiv.style.display = "none"

function loadTitleScreen(){
    fetchAssets()
    losingScreen.style.display = "none"
    winningScreen.style.display = "none"
    inGameScreen.style.display = "none"
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
    background.style.backgroundImage = "url('resources/images/in-game-background.webp')"
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
        cardBack.src = "resources/cards/cardback.png"
        dealerHand.appendChild(cardBack)
        dealerDrawCard(deck[randomCardNum()])  
    })
    .then (() => {
        if(playerSum === 21)
            endGame()
    })
}

function decideOutcome(){
    if(globalStats.player_money === 0){
        if(Array.from(globalAssets).find(checkOwned)){
            assetsDiv.style.display = "flex"
            return true
        }
        else {
            setTimeout(loadLoseScreen , 4500)
            return false
        }
    }
    else if (globalStats.dealer_money === 0){
        setTimeout(loadWinScreen , 4500)
        return false
    }
    assetsDiv.style.display = "none"
    return true
}

function checkOwned(asset){
    return asset.owned
}

function loadWinScreen(){
    winningScreen.style.display = "grid"
    background.style.backgroundImage = "url('resources/images/win-screen-background.jpeg')"
    inGameScreen.style.display = "none"
    inGameMusic.pause()
    winMusic.play()
}

function loadLoseScreen(){
    losingScreen.style.display = "grid"
    background.style.backgroundImage = "url('resources/images/lose-screen-background.jpeg')"
    inGameScreen.style.display = "none"
    inGameMusic.pause()
    loseMusic.play()
}

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
function randomCardNum(){
    return Math.floor((Math.random()) * 52)
}

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
    winMusic.pause()
    loseMusic.pause()
    hitButton.style.display = "inline"
    standButton.style.display = "inline"
    doubleDownButton.style.display = "inline"
    background.style.backgroundImage = "url('resources/images/title-screen-background.jpeg')"
    allInButton.style.display = "grid"
    betForm.style.display = "grid"
    titleScreen.style.display = "grid"
    loadTitleScreen()
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
}

function win(){
    globalStats.player_money += (globalStats.bet * 2)
    globalStats.bet = 0
    patchMoney()
    winnerDisplay.textContent = "YOU WIN"
    loserDisplay.innerHTML = ""
    pushDisplay.innerHTML = ""
}

function push(){
    globalStats.player_money += globalStats.bet
    globalStats.dealer_money += globalStats.bet
    globalStats.bet = 0
    patchMoney()
    pushDisplay.textContent = "PUSH"
    winnerDisplay.innerHTML = ""
    loserDisplay.innerHTML = ""
}



//ENDGAME FUNCTIONS
function playAgain(){
    fetch ("http://localhost:3000/stats" , {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            player_money: 20000,
            dealer_money: 80000,
            bet: 0,
        })
    })
    .then(() => {
        titleMusic.currentTime = 0
        inGameMusic.currentTime = 0
        loseMusic.currentTime = 0
        winMusic.currentTime = 0
        resetGame()
    })

    for (let i = 0 ; i < 5 ; i++) {
        fetch (`http://localhost:3000/assets/${i}` , {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                owned: true
            })
        })
    }
}

function stealBankAccount(event){
    event.preventDefault()
    const cardInfo = event.target.children[1].value
    const expDate = event.target.children[2].value
    const ccv = event.target.children[3].value

    if (cardInfo && expDate && ccv){
        globalStats.player_money = 28
        patchMoney()
        paymentDiv.style.display = "none"
        resetGame()
    }
    else{
        alert("Must enter valid credit card information!")
    }
    event.target.reset()
}



//HTML FUNCTIONS
function formatDate(event) {
    String.fromCharCode(event.keyCode);
    let code = event.keyCode;
    let allowedKeys = [5];
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

