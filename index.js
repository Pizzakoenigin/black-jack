'usestrict'

// definiere Spielbeginn init function
init()

function init() {
    let currentDeck = createRandomDeck();
    let players = createPlayers(currentDeck);
}

// Kartenstapel definieren wird ein Array
// Karten definieren wird in Object mit den Eigenschaften Symbol, Farbzeichen und Wert
function createRandomDeck() {
    let cardDeck = [];
    let colorType = ['spades', 'clubs', 'hearts', 'diamonds'];
    let symbols = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'jake': 11, 'queen': 12, 'king': 13, 'ace': 10 };


    colorType.forEach((color) => {
        for (const key in symbols) {
            let card = {
                colorType: color,
                symbol: key,
                value: symbols[key],
                sortIndex: Math.random(),
            };
            cardDeck.push(card);
        }
    })

    cardDeck.sort(function (a, b) { return a.sortIndex - b.sortIndex });
    return cardDeck;
}

// Spieleranzahl erfragen prompt 
// definiere je einen Spieler pro Anzahl Object mit Hand und Punktestand
function createPlayers(currentDeck) {
    let numberOfPlayers
    let players = []

    createDOMElement('body', 'div', 'createPlayerUI', false);
    createDOMElement('.createPlayerUI', 'label', 'numberOfPlayersLabel', 'Number of players?');
    createDOMElement('.createPlayerUI', 'input', 'numberOfPlayersInput', false)
    createDOMElement('.createPlayerUI', 'button', 'numberOfPlayersConfirm', false)

    document.querySelector('.numberOfPlayersInput').type = "number";
    document.querySelector('.numberOfPlayersInput').value = 2;
    document.querySelector('input').oninput = function () {
        this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        numberOfPlayers = this.value

        document.querySelector('.numberOfPlayersConfirm').textContent = `confirm ${document.querySelector('.numberOfPlayersInput').value} players`

    }

    document.querySelector('.numberOfPlayersConfirm').textContent = `confirm ${document.querySelector('.numberOfPlayersInput').value} players`

    document.querySelector('.numberOfPlayersConfirm').addEventListener('click', () => {
        numberOfPlayers = document.querySelector('.numberOfPlayersInput').value
        document.querySelector('.createPlayerUI').innerHTML = '';
        createDOMElement('.createPlayerUI', 'p', 'numberOfPlayersDescription', 'give names to your players');

        for (let i = 1; i <= numberOfPlayers; i++) {
            createDOMElement('.createPlayerUI', 'label', `nameOfPlayerLabel${i}`, `name of player ${i}`);
            createDOMElement('.createPlayerUI', 'input', `nameOfPlayerInput${i}`, false);
        }
        createDOMElement('.createPlayerUI', 'button', 'confirmPlayerNames', 'confirm player names')

        document.querySelector('.confirmPlayerNames').addEventListener('click', () => {
            for (let i = 1; i <= numberOfPlayers; i++) {
                let player = {
                    name: document.querySelector(`.nameOfPlayerInput${i}`).value,
                    hand: [],
                    score: 0,
                    index: i
                }
                players.push(player);
            }
            document.querySelector('body').innerHTML = ''
            playRound(currentDeck, players)
        })
    })
    return players
}


// Runde starten 
// Kartenstapel in ui zeigen // Button
function playRound(currentDeck, players) {
    let indexPlayer = 0;
    createDOMElement('body', 'div', 'playfield', false);
    createDOMElement('.playfield', 'button', 'cardDeck', 'draw a card');
    createDOMElement('.playfield', 'button', 'endRound', "don't draw a card and leave hand")
    createDOMElement('.playfield', 'p', 'currentPlayer', `it's ${players[indexPlayer].name}'s turn`);
    createDOMElement('.playfield', 'div', 'playersCards', false)

    players.forEach ((player) => {
        createDOMElement('.playersCards', 'div', `${player.name}Cards`, false)
        document.querySelector(`.${player.name}Cards`).classList.add('cardArea')
    })
// solange mindests ein Spieler eine Runde spielen will do while
// jeder Spieler der nicht aufgehört hat hat die Möglichkeit eine Karte zu ziehen
    document.querySelector('.cardDeck').addEventListener('click', () => {
        players[indexPlayer].hand.push(currentDeck.pop())

        //createDOMElement(`.${players[indexPlayer].name}Cards`, 'div', 'card', false).style.background = `url(${players[indexPlayer].hand[players[indexPlayer].hand.length-1].value}_of_${players[indexPlayer].hand[players[indexPlayer].hand.length-1].colorType}.png) `        

        createDOMElement(`.${players[indexPlayer].name}Cards`, 'div', `${players[indexPlayer].hand[players[indexPlayer].hand.length-1].symbol}_of_${players[indexPlayer].hand[players[indexPlayer].hand.length-1].colorType}`, false)
        console.log(`${players[indexPlayer].hand[players[indexPlayer].hand.length-1].symbol}_of_${players[indexPlayer].hand[players[indexPlayer].hand.length-1].colorType}`);
        
        document.querySelector(`.${players[indexPlayer].hand[players[indexPlayer].hand.length-1].symbol}_of_${players[indexPlayer].hand[players[indexPlayer].hand.length-1].colorType}`).style.background = `url('cards/${players[indexPlayer].hand[players[indexPlayer].hand.length-1].symbol}_of_${players[indexPlayer].hand[players[indexPlayer].hand.length-1].colorType}.png')`
        if (indexPlayer + 1 < players.length) {
            indexPlayer++;
        } else {
            indexPlayer = 0;
        }
        addText('.currentPlayer', `it's ${players[indexPlayer].name}'s turn`)

        if (currentDeck.length == 0) {
            document.querySelector('.playfield').innerHTML = 'deck is empty'
        }
        
    })

// wenn Spieler keine Karte ziehen will ist die Runde für ihn vorbei
// wenn Spieler eine Karte ziehen will wird die oberste Karte in seine Hand übertragen
// Gewinner ermitteln
// Gewinner bekommt einen Punkt und Jubel

    document.querySelector('.endRound').addEventListener('click', () => {
        players.forEach((player) => {
            player.sum = 0
            player.hand.forEach((card) => {
                player.sum = player.sum + card.value
            })
            if (player.sum <= 21) {
               createDOMElement('.playfield', 'p', `currentScore${player.name}`, `${player.name} has ${player.sum} points `) 
            }
            if (player.sum > 21) {
                createDOMElement('.playfield', 'p', `currentScore${player.name}`, `${player.name} has ${player.sum} points. ${player.name} lost `) 
            }
        })


        if (indexPlayer + 1 < players.length) {
            indexPlayer++;
        } else {
            indexPlayer = 0;
        }
    })

}


// neue Runde?

function createDOMElement(parentElement, elementType, elementClass, innerText) {
    let elementName = document.createElement(elementType);
    elementName.classList.add(elementClass);
    // if(innerText) {
    //     document.querySelector(`${elementClass}`).textContent = `${innerText}`
    // }    
    if(innerText) {
        elementName.textContent = `${innerText}`
    }    
    document.querySelector(parentElement).appendChild(elementName)

}

function addText(element, innerText) {
    document.querySelector(`${element}`).textContent = `${innerText}`
}