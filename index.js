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
    let symbols = { 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'jack': 11, 'queen': 12, 'king': 13, 'ace': 10 };


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
                    index: i,
                    sum: 0
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
    createDOMElement('.playfield', 'button', 'cardDeck', false);
    createDOMElement('.playfield', 'p', 'cardDeckLabel', 'draw a card')
    createDOMElement('.playfield', 'button', 'endRound', "don't draw a card and leave hand")
    createDOMElement('.playfield', 'button', 'restart', "restart")
    createDOMElement('.playfield', 'p', 'currentPlayer', `it's ${players[indexPlayer].name}'s turn`);
    createDOMElement('.playfield', 'div', 'playersCards', false)

    function createCard(players, selectorCurrentCard) {


        createDOMElement(`.${players[indexPlayer].name}Cards`, 'div', `${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}`, false)
        createDOMElement(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}`, 'div', `${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-inner`, false)
        createDOMElement(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-inner`, 'div', `${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-front`, false)
        createDOMElement(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-inner`, 'div', `${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-back`, false)

        document.querySelector(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}`).classList.add('card')
        document.querySelector(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-inner`).classList.add('card-inner')
        document.querySelector(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-front`).classList.add('card-back')
        document.querySelector(`.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-back`).classList.add('card-front')

        let backside = `.${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}-front`
        document.querySelector(backside).style.background = `url('cards/${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}.png')`
    }

    players.forEach((player) => {
        createDOMElement('.playersCards', 'div', `${player.name}Cards`, false)
        document.querySelector(`.${player.name}Cards`).classList.add('cardArea')
        createDOMElement('.playfield', 'p', `currentScore${player.name}`, `${player.name} has ${player.sum}`)
        if (player.hand.length != 0) {
            for (let i = 0; player.hand.length; i++) {
                createCard(players, player.hand[i])
            }
        }

    })
    // solange mindests ein Spieler eine Runde spielen will do while
    // jeder Spieler der nicht aufgehört hat hat die Möglichkeit eine Karte zu ziehen
    document.querySelector('.cardDeck').addEventListener('click', () => {
        players[indexPlayer].hand.push(currentDeck.pop())
        let selector = players[indexPlayer].hand[players[indexPlayer].hand.length - 1]
        createCard(players, selector)






        checkForWinner(players)


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
        checkForWinner(players)
        if (indexPlayer + 1 < players.length) {
            indexPlayer++;
        } else {
            indexPlayer = 0;
        }
    })


    document.querySelector('.restart').addEventListener('click', () => {
        document.querySelector('body').innerHTML = ''
        currentDeck = createRandomDeck();
        players.forEach(player => {
            player.hand = []
            player.sum = 0
        })
        playRound(currentDeck, players)
    })


    function checkForWinner(players) {
        players.forEach((player) => {
            player.sum = 0
            player.hand.forEach((card) => {
                player.sum = player.sum + card.value
            })
            if (player.sum <= 21) {
                document.querySelector(`.currentScore${player.name}`).textContent = `${player.name} has ${player.sum} points.`

            }
            if (player.sum > 21) {
                document.querySelector(`.currentScore${player.name}`).textContent = `${player.name} has ${player.sum} points. ${player.name} lost `
                // players[player.index].pop
                playersFiltered = players.filter(function (filterOut) { return filterOut.index != player.index })
                players = playersFiltered
                if (players.length > 1) {

                    playRound(currentDeck, players)
                }

                if (players.length = 1) {
                    console.log(players[0].name);
                    document.querySelector('.cardDeck').disabled = true
                    document.querySelector('.endRound').disabled = true
                    document.querySelector(`.currentScore${players[0].name}`).textContent = `${players[0].name} has won!`
                    player.score++
                }



            }


        })
    }

}


// neue Runde?

function createDOMElement(parentElement, elementType, elementClass, innerText) {
    let elementName = document.createElement(elementType);
    elementName.classList.add(elementClass);
    // if(innerText) {
    //     document.querySelector(`${elementClass}`).textContent = `${innerText}`
    // }    
    if (innerText) {
        elementName.textContent = `${innerText}`
    }
    document.querySelector(parentElement).appendChild(elementName)

}

function addText(element, innerText) {
    document.querySelector(`${element}`).textContent = `${innerText}`
}