var memoryGame = {

    cards: ["0C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "AC", "JC", "KC", "QC",
            "0D", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "AD", "JD", "KD", "QD",
            "0H", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "AH", "JH", "KH", "QH",
            "0S", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "AS", "JS", "KS", "QS"],

    shuffle: function (arr) {
        var shuffledArr = [],
            initialArr = arr.slice(0, arr.length + 1),
            index;
        while (initialArr.length !== 0) {
            index = Math.floor(initialArr.length * Math.random());
            shuffledArr.push(initialArr[index]);
            initialArr.splice(index, 1);
        }
        return shuffledArr;
    },

    iterateCollection: function (collection, func) {
        Array.prototype.forEach.call(document.querySelectorAll(collection), func);
    },

    toggleScreen: function (screen) {
        var screens = [".start-screen", ".game-screen", ".end-screen"];
        screens.forEach(function (item) {
            document.querySelector(item).style.display = "none";
        });
        document.querySelector(screen).style.display = "block";
    },

    init: (function () {
        var flipDeckOnTimeOut,
            checkMatchOnTimeOut;
        return function () {
            var flippedCards = [],
                pairsLeft = 9,
                score = 0,
                cardSet = (this.shuffle(this.cards)).slice(0, 9),
                deck = this.shuffle(cardSet.concat(cardSet));
            this.iterateCollection(".card__content--front", function (card, index) {
                card.style.background = "url('images/" + deck[index] + ".png') 0% 0% / contain no-repeat";
            });
            this.iterateCollection(".card__container", function (card, index) {
                card.classList.remove("card__container--flipped");
                card.classList.remove("card__container--removed");
            });
            document.querySelector(".game-screen__score").innerHTML = score;
            this.toggleScreen(".game-screen");
            clearTimeout(checkMatchOnTimeOut);
            clearTimeout(flipDeckOnTimeOut);
            flipDeckOnTimeOut = setTimeout(function () {
                memoryGame.iterateCollection(".card__container", function (card, index) {
                    card.classList.add("card__container--flipped");
                });
            }, 5000);
            document.querySelector(".game-screen__deck").onclick = function (event) {
                var target = event.target.parentNode;
                if (target && target.classList.contains("card__container--flipped") && flippedCards.length < 2) {
                    document.querySelector(".flip-sound").play();
                    target.classList.remove("card__container--flipped");
                    flippedCards.push(target);
                    if (flippedCards.length === 2) {
                        checkMatchOnTimeOut = setTimeout(function () {
                            if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
                                flippedCards.forEach(function (item) {
                                    item.classList.add("card__container--removed");
                                });
                                flippedCards = [];
                                pairsLeft--;
                                score += (pairsLeft * 42);
                                if (pairsLeft === 0) {
                                    memoryGame.toggleScreen(".end-screen");
                                    document.querySelector(".end-screen__message").innerHTML = "Поздравляем!<br>Ваш итоговый счет: " + score;
                                    document.querySelector(".endgame-sound").play();
                                }
                            } else {
                                flippedCards.forEach(function (item) {
                                    item.classList.add("card__container--flipped");
                                });
                                flippedCards = [];
                                score -= ((9 - pairsLeft) * 42);
                            }
                            document.querySelector(".game-screen__score").innerHTML = score;
                        }, 1000);
                    }
                }
            };
        };
    }())
};

document.querySelector(".memory-game").addEventListener('click', function (event) {
    if (event.target.classList.contains("button")) {
        memoryGame.init();
    }
});
