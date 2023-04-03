fetch('http://localhost:3000/cards')
 .then(response => response.json())
 .then(data => {
    data.forEach(displayCard)
 })

 function displayCard(card){
    const newCard = document.createElement("img")
    newCard.src = card.image
    document.querySelector("body").append(newCard)
 }