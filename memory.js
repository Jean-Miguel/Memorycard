// -------GLOBALE --------
const deck = document.querySelector('.deck');
let toggledCards = []; // vitrine des cartes
let moves = 0;
// variables globales pour le timer
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
/*
 * Afficher les cartes sur la page
 * Mélangez la liste des cartes en utilisant la méthode "shuffle" fournie ci-dessous.
 * Boucle dans chaque carte et création de son HTML
 * - ajouter le HTML de chaque carte à la page
 */

 function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
 }
 shuffleDeck();

// Shuffle function 
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * configurer l'écouteur d'événements pour une carte. Si une carte est cliquée :
 * - afficher le symbole de la carte (placez cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci)
 * - ajouter la carte à une *liste* de cartes "ouvertes" (mettre cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci)
 * - si la liste contient déjà une autre carte, vérifiez si les deux cartes correspondent.
 * + si les cartes correspondent, verrouillez les cartes en position ouverte (mettez cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci)
 * + si les cartes ne correspondent pas, retirer les cartes de la liste et cacher le symbole de la carte (mettre cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci).
 * + incrémenter le compteur de coups et l'afficher sur la page (mettre cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci)
 * + si toutes les cartes ont été appariées, afficher un message avec le score final (mettre cette fonctionnalité dans une autre fonction que vous appelez à partir de celle-ci).
 */

 deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch();
            addMove();
            checkScore();
        }
    }
 });

//Fonction permettant de vérifier que la cible ne contient pas la classe "card" & match", pas plus de 2 cartes.
function isClickValid(clickTarget) {
    return (
            clickTarget.classList.contains('card') &&
            !clickTarget.classList.contains('match') &&
            toggledCards.length < 2 &&
            !toggledCards.includes(clickTarget)
        );
}

// fonctionnalité du timer
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

// afficher le timer
function displayTime() {
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

// Fonction permettant de faire basculer les cartes
function toggleCard(card){
    card.classList.toggle('open');
    card.classList.toggle('show');
 }

// Fonction pour pousser clickTarget dans le tableau toggleCards
function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}

// Fonction permettant de vérifier si les cartes correspondent
function checkForMatch() {
    const TOTAL_PAIRS = 8;
    if (
        toggledCards[0].firstElementChild.className === 
        toggledCards[1].firstElementChild.className
        ) { // Basculer la classe de correspondance
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match'); 
            toggledCards = [];
            matched++; 
            if (matched === TOTAL_PAIRS) {
                gameOver();
            }

    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
    }, 1000);
    }
}
// game over fonction
function gameOver() {
    stopClock();
    toggleModal();
    writeModalStats();   
}

// Stopper le timer
function stopClock() {
    clearInterval(clockId);
}

// ---------- POP UP MODAL --------- //
function toggleModal() {
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const moveStat = document.querySelector('.modal_moves');
    const starStat = document.querySelector('.modal_stars');
    const stars = getStars();

    timeStat.innerHTML = `Temps = ${clockTime}`;
    moveStat.innerHTML = `Mouvements = ${moves}`;
    starStat.innerHTML = `étoiles = ${stars}`;
}

// obtient des étoiles
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

// Fonction qui compte les coups pour le tableau d'affichage
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}
// calculer le nombre d'étoiles dans le tableau d'affichage
function checkScore() {
    if (moves === 16 || moves === 24) {
        hideStar();
    }
}
// Cacher les étoiles
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

// --------- MODAL BOUTONS--------- //

// Bouton annuler
document.querySelector('.modal_cancel').addEventListener('click' , () => {
    toggleModal();
});

// bouton rejouer
document.querySelector('.modal_replay').addEventListener('click' , replayGame);

// fonction rejouer
function replayGame() {
    resetGame();
    toggleModal();
}

// Rafraichir le jeu avec l'icone rafraichir
document.querySelector('.restart').addEventListener('click' , resetGame);

function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}

// remise a zéro du timer
function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

// remise  à zéro des mouvements
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

// remise à zéro des étoiles
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

// remise à zéro des cartes
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
