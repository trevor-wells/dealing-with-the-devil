# **dealing with the devil**

a blackjack game with a few fun twists, using art from the 2017 run-and-gun platformer *cuphead*.

## **installation**

to set up the app on your local machine, navigate to the project folder in your terminal and type:
```
npm install
json-server --watch db.json
```
*if you don't have json server installed, type:*
```
npm install -g json-server
```

## **how to play**

you have found yourself playing a game of blackjack against the devil himself. rid him of all of his gold or be thrown into the pits of hell!

### <ins>**betting**</ins>

you start the game with a mere 20,000 gold, while the devil has 80,000.

you may either choose an amount to bet or go all in.

once you've made your bet, click 'deal' to start the game.

### <ins>**the rules**</ins>

your objective is to beat the devil. this can be done in three ways:

1. by drawing a hand value that does not exceed 21 and is higher than the devil's hand value
2. by the devil drawing a hand value that goes over 21
3. by drawing a hand value of 21 on your first two cards, when the dealer does not

<ins>**card values**</ins>

• 2-10 count at face value

• face cards (J, Q, K) count as 10

• ace can count as a 1 or an 11

<ins>**in-game options**</ins>

**stand** - end the round with the cards you currently have

**hit** - add a random card to your hand

**double down** - double your bet and add a random card to your hand. end the round

**surrender** - give up your hand in exchange for half of your original bet back

(**split** and **insurance** are not included in this game)

### <ins>**selling your assets**</ins>

if you run out of your gold, you will be presented with the option to sell your assets. you may continue to play as long as you have assets to sell.

## **folder structure**
```
.
.
├── node_modules
├── resources
│   ├── cards
│   ├── images
│   └── music
├── db.json
├── index.html
├── index.js
└── ...
```

• **node_modules** - contains installed dependencies acquired through `npm install`

• **resources** - contains all assets used in the project

• **cards** - contains .pngs of all cards

• **images** - contains background images and sprites

• **music** - contains .mp3s of all music

• **db.json** - json database file used to store game data

• **index.html** - contains each game screen split into different divs

• **index.js** - contains functions for all game logic

## **technologies used**

• vanilla javascript  (ES13)

• screenfull          (6.0.2)

## **features**
*insert key features here (client-side routing, talk about the logic used, typed library, etc)*

## **demo / walkthrough**
*insert link to loom video with thumbnail here*

## **license**
dealing with the devil is available under the mit license. see the license.txt file for more info.

## **contact information**
[github](https://github.com/trevor-wells)

[linkedin](https://www.linkedin.com/in/trevor-e-wells/)
