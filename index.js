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
    createDOMElement('.createPlayerUI', 'h1', 'numberOfPlayersLabel', 'Number of players?');
    createDOMElement('.createPlayerUI', 'input', 'numberOfPlayersInput', false)
    createDOMElement('.createPlayerUI', 'button', 'numberOfPlayersConfirm', false)

    document.querySelector('.numberOfPlayersInput').type = "number";
    document.querySelector('.numberOfPlayersInput').value = 2;
    document.querySelector('input').oninput = function () {
        this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        numberOfPlayers = this.value
        addText('.numberOfPlayersConfirm', `Confirm ${document.querySelector('.numberOfPlayersInput').value} players`)
    }

    document.querySelector('.numberOfPlayersConfirm').textContent = `Confirm ${document.querySelector('.numberOfPlayersInput').value} players`

    document.querySelector('.numberOfPlayersConfirm').addEventListener('click', () => {
        numberOfPlayers = document.querySelector('.numberOfPlayersInput').value
        document.querySelector('.createPlayerUI').innerHTML = '';
        createDOMElement('.createPlayerUI', 'h1', 'numberOfPlayersDescription', 'Give names to your players');

        for (let i = 1; i <= numberOfPlayers; i++) {
            createDOMElement('.createPlayerUI', 'label', `nameOfPlayerLabel${i}`, `Name of player ${i}`);
            createDOMElement('.createPlayerUI', 'input', `nameOfPlayerInput${i}`, false);
        }
        createDOMElement('.createPlayerUI', 'button', 'confirmPlayerNames', 'Confirm player names')

        document.querySelector('.confirmPlayerNames').addEventListener('click', () => {
            for (let i = 1; i <= numberOfPlayers; i++) {
                let player = {
                    name: document.querySelector(`.nameOfPlayerInput${i}`).value,
                    hand: [],
                    score: 0,
                    index: i,
                    sum: 0,
                    inGame: true,
                }
                players.push(player);
            }
            document.querySelector('body').innerHTML = ''
            createGamefield(currentDeck, players)
        })
    })
    return players
}


// Runde starten 
// Kartenstapel in ui zeigen // Button
function createGamefield(currentDeck, players) {
    document.querySelector('body').innerHTML = ''
    // console.log(players);
    let indexPlayer = 0;
    // setInterval(checkIndexPlayer(players, indexPlayer), 1)
    createDOMElement('body', 'div', 'playfield', false);
    createDOMElement('.playfield', 'div', 'gameButtons', false)
    createDOMElement('.gameButtons', 'button', 'restart', "New Round")
    createDOMElement('.gameButtons', 'div', 'cardDeckContainer', false)
    createDOMElement('.cardDeckContainer', 'button', 'cardDeck', false);
    createDOMElement('.cardDeckContainer', 'p', 'cardDeckLabel', 'Draw a card')
    createDOMElement('.gameButtons', 'button', 'endRound', "Don't draw a card and leave hand")
    createDOMElement('.playfield', 'div', 'playersCards', false)

    players.forEach((player) => {
        if (player.inGame) {
            createDOMElement('.playersCards', 'div', `${player.name}Cards`, false)
            createDOMElement(`.${player.name}Cards`, 'p', `${player.name}Turn`, `${player.name}`);
            document.querySelector(`.${player.name}Cards`).classList.add('cardArea')
            createDOMElement(`.${player.name}Cards`, 'div', `${player.name}Hand`)
            document.querySelector(`.${player.name}Hand`).classList.add('handCards')
            createDOMElement(`.${player.name}Cards`, 'p', `${player.name}CurrentScore`, `${player.name} has ${player.sum} points. player score: ${player.score}`)
            document.querySelector(`.${player.name}CurrentScore`).classList.add('currentScore')

            if (player.hand.length != 0) {
                for (let i = 0; i < player.hand.length; i++) {
                    createCard(player, player.hand[i])
                }
            }
        }


    })

    document.querySelector(`.${players[indexPlayer].name}Cards`).style.background = 'rgba(255, 255, 255, 0.5)'
    document.querySelector(`.${players[indexPlayer].name}Cards`).classList.add('rotate')
    document.querySelector(`.${players[indexPlayer].name}CurrentScore`).style.opacity = '100%'

    document.querySelector('.cardDeck').addEventListener('click', () => {
        addText(`.${players[indexPlayer].name}Turn`, `${players[indexPlayer].name}`)

        if (players[indexPlayer].inGame) {
            players[indexPlayer].hand.push(currentDeck.pop())
            let selector = players[indexPlayer].hand[players[indexPlayer].hand.length - 1]
            createCard(players[indexPlayer], selector)
            checkForWinner(players, currentDeck)
            
        }

        checkIndexPlayer()
        checkForLastPlayer(players, indexPlayer)

        if (currentDeck.length == 0) {
            addText('.playfield', 'deck is empty')
        }
    })

    document.querySelector('.endRound').addEventListener('click', () => {
        // check nur noch ein spieler übrig. spieler gewinnt
        checkIndexPlayer()
        checkForLastPlayer()

    })

    document.querySelector('.restart').addEventListener('click', () => {
        document.querySelector('body').innerHTML = ''
        currentDeck = createRandomDeck();
        players.forEach(player => {
            player.hand = []
            player.sum = 0
            player.inGame = true
        })
        createGamefield(currentDeck, players)
    })

    function createCard(player, selectorCurrentCard) {
        createDOMElement(`.${player.name}Hand`, 'div', `${selectorCurrentCard.symbol}_of_${selectorCurrentCard.colorType}`, false)
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

    function checkIndexPlayer() {
        if (players[indexPlayer].inGame) {
            document.querySelector(`.${players[indexPlayer].name}Cards`).style.background = 'none'
            document.querySelector(`.${players[indexPlayer].name}Cards`).classList.remove('rotate')
            document.querySelector(`.${players[indexPlayer].name}CurrentScore`).style.opacity = '0%'
        }

        let leftOutPlayers = 0
        for (let i = 0; i < players.length; i++) {
            if (!players[i].inGame) {
                leftOutPlayers++
            }
        }

        if (leftOutPlayers == players.length) {
            return
        }

        if (indexPlayer + 1 < players.length) {
            indexPlayer++;
            if (!players[indexPlayer].inGame) {
                checkIndexPlayer()
            }
        } else {
            indexPlayer = 0;
            if (!players[indexPlayer].inGame) {
                checkIndexPlayer()
            }
        }
        addText(`.${players[indexPlayer].name}Turn`, `It's ${players[indexPlayer].name}'s turn`)
        document.querySelector(`.${players[indexPlayer].name}Cards`).style.background = 'rgba(255, 255, 255, 0.5)'
        document.querySelector(`.${players[indexPlayer].name}Cards`).classList.add('rotate')
        document.querySelector(`.${players[indexPlayer].name}CurrentScore`).style.opacity = '100%'
    }

}

function checkForWinner(players) {
    players.forEach((player) => {
        if (player.inGame) {
            player.sum = 0
            player.hand.forEach((card) => {
                player.sum = player.sum + card.value
            })
            if (player.sum < 21) {
                addText(`.${player.name}CurrentScore`, `${player.name} has ${player.sum} points. player score: ${player.score}`)
            }

            if (player.sum == 21) {
                player.score++
                player.inGame = false
                document.querySelector(`.${player.name}Cards`).style.background = 'green'
                document.querySelector(`.${player.name}Cards`).classList.add('transparent')
                document.querySelector(`.${player.name}Cards`).classList.add('rotate')
                document.querySelector(`.${player.name}CurrentScore`).style.opacity = '100%'
                addText(`.${player.name}CurrentScore`, `${player.name} has ${player.sum} points. has won! player score: ${player.score}`)
            }

            if (player.sum > 21) {
                document.querySelector(`.${player.name}Cards`).style.background = 'gray'
                document.querySelector(`.${player.name}Cards`).classList.add('rotate')
                document.querySelector(`.${player.name}CurrentScore`).style.opacity = '100%'
                addText(`.${player.name}CurrentScore`, `${player.name} has ${player.sum} points. ${player.name} lost. player score: ${player.score} `)
                player.inGame = false
            }
        }
    })
}

function checkForLastPlayer(players, indexPlayer) {
    let activePlayers = 0

    for (let i = 0; i < players.length; i++) {
        if (players[i].inGame) {
            activePlayers++
        }
    }

    if (activePlayers == 1 && players[indexPlayer].inGame) {
        players[indexPlayer].score++
        players[indexPlayer].inGame = false
        document.querySelector(`.${players[indexPlayer].name}Cards`).style.background = 'green'
        document.querySelector(`.${players[indexPlayer].name}Cards`).classList.add('transparent')
        document.querySelector(`.${players[indexPlayer].name}Cards`).classList.add('rotate')
        document.querySelector(`.${players[indexPlayer].name}CurrentScore`).style.opacity = '100%'

        addText(`.${players[indexPlayer].name}CurrentScore`, `${players[indexPlayer].name} is the last active player and get's a point! player score: ${players[indexPlayer].score}`)
    }
}



function createDOMElement(parentElement, elementType, elementClass, innerText) {
    let elementName = document.createElement(elementType);
    elementName.classList.add(elementClass);
    if (innerText) {
        elementName.textContent = `${innerText}`
    }
    document.querySelector(parentElement).appendChild(elementName)

}

function addText(element, innerText) {
    document.querySelector(`${element}`).textContent = `${innerText}`
}