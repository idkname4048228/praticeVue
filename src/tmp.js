let cards = [];
let cardVis = document.getElementsByClassName("card");
const confirmButton = document.getElementById("bet-button");
const bigButton = document.getElementById("big");
const openButton = document.getElementById("open");
const smallButton = document.getElementById("small");

let canClickCONFIRM = false;
let canClickBIGorSMALL = false;
let canClickOPEN = false;
let gameover = true;

function draw(cards) {
  // draw one card and push to cards
  let currCard = Math.floor(Math.random() * 52);
  let drawn = true;
  while (drawn) {
    let i;
    for (i = 0; i < cards.length; i++) {
      if (cards[i] == currCard) {
        break;
      }
    }
    if (i != cards.length) {
      // one of the cards has been drawn
      currCard = Math.floor(Math.random() * 52);
    } else {
      drawn = false;
    }
  }
  cards.push(currCard);
}

function checkDoor(cards) {
  return (cards[0] % 13) - (cards[2] % 13);
}

function printCard(card) {
  // number to card
  let result = "";
  let suit = Math.floor(card / 13);
  let rank = (card % 13) + 1;
  switch (suit) {
    case 0:
      result += "Spade ";
      break;
    case 1:
      result += "Heart ";
      break;
    case 2:
      result += "Diamond ";
      break;
    case 3:
      result += "Club ";
      break;
    default:
      result += "error";
      break;
  }

  switch (rank) {
    case 1:
      result += "Ace";
      break;
    case 11:
      result += "Jack";
      break;
    case 12:
      result += "Queen";
      break;
    case 13:
      result += "King";
      break;
    default:
      result += rank;
      break;
  }

  return result;
}

function checkResult1(cards) {
  // for check inside or outside
  let left = cards[0] % 13;
  let right = cards[2] % 13;
  let between = cards[1] % 13;
  if (left == between || right == between) {
    return 0; // hit on the door
  } else if (
    (left < between && between < right) ||
    (left > between && between > right)
  ) {
    return 1;
  } else {
    return -1;
  }
}

function checkResult2(cards, flag) {
  // for guess above or below
  let left = cards[0] % 13;
  let between = cards[1] % 13;

  if (left == between) {
    // A A A
    return 0;
  } else if (
    (flag == -1 && left - between > 0) ||
    (flag == 1 && between - left > 0)
  ) {
    // A 10 A or K 5 K
    return 1;
  } else {
    // 6 5 6 or 10 K 10
    return -1;
  }
}

function play() {
  cards = [];
  for (let i = 0; i < 3; i++) {
    draw(cards);
  }
  showCard(0);
  showCard(2);

  if (checkDoor(cards) == 0) {
    // if guess above or below; print rule at console
    console.log("enter 1 : guess above");
    console.log("enter 2 : guess below");
    console.log();
    console.log("If the third card has the same rank as the first two cards,");
    console.log("you will have to pay two times the bet in addition.");
    console.log();
    canClickBIGorSMALL = true;
    canClickOPEN = false;
    bigButton.style.opacity = 1;
    openButton.style.opacity = 0.5;
    smallButton.style.opacity = 1;
  } else {
    canClickOPEN = true;
    canClickBIGorSMALL = false;
    bigButton.style.opacity = 0.5;
    openButton.style.opacity = 1;
    smallButton.style.opacity = 0.5;
  }
}

function showCard(index) {
  // update target card; 0:left 1:middle 2:right
  let cardStrings = printCard(cards[index]).split(" ");
  let targetCard = cardVis[index];
  let querySelectString;
  let suit, rank, color;
  switch (index) {
    case 0:
      querySelectString = "#first-card use";
      break;
    case 1:
      querySelectString = "#second-card use";
      break;
    case 2:
      querySelectString = "#third-card use";
      break;
    default:
      break;
  }

  switch (cardStrings[0]) {
    case "Spade":
      suit = "#spade";
      color = "#222";
      break;
    case "Heart":
      suit = "#heart";
      color = "#d22";
      break;
    case "Diamond":
      suit = "#diamonds";
      color = "#d22";
      break;
    case "Club":
      suit = "#clubs";
      color = "#222";
      break;
    default:
      break;
  }

  switch (cardStrings[1]) {
    case "Ace":
      rank = "A";
      break;
    case "Jack":
      rank = "J";
      break;
    case "Queen":
      rank = "Q";
      break;
    case "King":
      rank = "K";
      break;
    default:
      rank = cardStrings[1];
      break;
  }

  targetCard.querySelector(querySelectString).setAttribute("href", suit);
  targetCard.querySelector(querySelectString).setAttribute("color", color);
  targetCard.querySelector(".card-num").style.color = color;
  targetCard.querySelector(".card-num").textContent = rank;
}

function open1(bet) {
  // open middle card; in guessing inside or outside
  console.log("left: " + printCard(cards[0]));
  console.log("between: " + printCard(cards[1]));
  console.log("right: " + printCard(cards[2]));
  showCard(1);
  let result = checkResult1(cards);
  switch (result) {
    case 0: // addition 1 times
      bet *= -2;
      break;
    case 1: // win
      bet *= 1;
      break;
    case -1: // lose
      bet *= -1;
      break;
    default:
      console.log("error");
      break;
  }
  return bet;
}

function open2(bet, flag) {
  console.log("left: " + printCard(cards[0]));
  console.log("between: " + printCard(cards[1]));
  console.log("right: " + printCard(cards[2]));
  showCard(1);
  let result = checkResult2(cards, flag);
  switch (result) {
    case 0: //addition 2 times
      bet *= -3;
      break;
    case 1: // win
      bet *= 1;
      break;
    case -1: // lose
      bet *= -1;
      break;
    default:
      console.log("error");
      break;
  }
  return bet;
}

function count(limit) {
  // animation for bet number
  let start = document.getElementById("bet-number").innerText;
  start = parseInt(start);
  let end = parseInt(limit);
  const duration = 5000;

  let current = start;
  let increment = (end - start) / (duration / 1000);

  let interval = setInterval(update, 40);

  function update() {
    current += increment;

    if ((start >= end && current <= end) || (start <= end && current >= end)) {
      clearInterval(interval);
      current = end;
    }

    document.getElementById("bet-number").innerText = Math.round(current);
  }
}

var inputBet;


let infoModal = document.querySelector("#infoModal");

function showDialog(str, img) {
  let dialogText = document.getElementById("dialog-text");
  if (img) {
    dialogText.style.display = "flex";
    dialogText.style.justifyContent = "center";
    dialogText.style.alignItems = "center";
    dialogText.innerHTML = `<img
  src="alreadyDead.png"
  alt="You are already dead."
  height="100%"
  aspect-ratio: 3/2;
/>`;

  } else {

    dialogText.style.display = "";
    dialogText.style.justifyContent = "";
    dialogText.style.alignItems = "";
    dialogText.innerText = str;
  }
  dialogBtn = document.querySelector("#dialog-button");
  dialogBtn.addEventListener("click", function () {
    infoModal.close();
  });

  dialogBtn.textContent = "close";

  infoModal.showModal();
}

function changeDialog(str) {
  infoModal.innerHTML = str + `
<button id="dialog-button">close</button>
  `;
}


confirmButton.addEventListener("click", (e) => {
  //listen a button; click to start game
  e.preventDefault();

  let currBet = document.getElementById("bet-number").innerText; // own bet
  currBet = parseInt(currBet);
  inputBet = document.getElementById("bet-input").value;

  if (inputBet <= 0) {
    showDialog("賭注需大於0!", false);
    console.log("賭注需大於0!");
  } else if (currBet < inputBet) {
    showDialog("不可輸入超過擁有的賭注!", false);
    console.log("不可輸入超過擁有的賭注!");
    canClickCONFIRM = false;
  } else if (canClickBIGorSMALL || canClickOPEN || !gameover) {
    canClickCONFIRM = false;
  } else {
    canClickCONFIRM = true;
  }

  if (canClickCONFIRM) {
    canClickCONFIRM = false;
    gameover = false;
    play();
    cardVis[0].style.transform = "rotateY(0deg)";
    cardVis[0].style.boxShadow = "2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
    cardVis[2].style.transform = "rotateY(0deg)";
    cardVis[2].style.boxShadow = "2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
  }
});

bigButton.addEventListener("click", () => {
  // guess big and open the result
  if (canClickBIGorSMALL) {
    let bet = inputBet;
    let bet_result = open2(bet, 1);
    let bet_number = document.getElementById("bet-number").innerText;
    let diff = document.getElementById("diff");
    bet_number -= -1 * bet_result;
    let tmp = parseInt(bet_result);
    diff.innerText = (tmp > 0 ? " +" : " ") + bet_result;
    diff.style.color = tmp > 0 ? "#2bdd2b" : "#ff4444";
    count(bet_number);
    cardVis[1].style.transform = "rotateY(0deg)";
    cardVis[1].style.boxShadow = "2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
    // console.log(bet_result);
    setTimeout(() => {
      diff.innerText = "";
      end();
    }, 1500);
    canClickBIGorSMALL = false;
    canClickOPEN = false;
    updateDB(bet_result);
  }
});

openButton.addEventListener("click", () => {
  // open the result of inside or outside
  if (canClickOPEN) {
    let bet = inputBet;
    let bet_result = open1(bet);
    let bet_number = document.getElementById("bet-number").innerHTML;
    let diff = document.getElementById("diff");
    bet_number -= -1 * bet_result;
    let tmp = parseInt(bet_result);
    diff.innerText = (tmp > 0 ? " +" : " ") + bet_result;
    diff.style.color = tmp > 0 ? "#2bdd2b" : "#ff4444";
    count(bet_number);
    cardVis[1].style.transform = "rotateY(0deg)";
    cardVis[1].style.boxShadow = "2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
    // console.log(bet_result);
    setTimeout(() => {
      diff.innerText = "";
      end();
    }, 1500);
    canClickBIGorSMALL = false;
    canClickOPEN = false;
    updateDB(bet_result);
  }
});

smallButton.addEventListener("click", () => {
  if (canClickBIGorSMALL) {
    let bet = inputBet;
    let bet_result = open2(bet, -1);
    let bet_number = document.getElementById("bet-number").innerText;
    let diff = document.getElementById("diff");
    bet_number -= -1 * bet_result;
    let tmp = parseInt(bet_result);
    diff.innerText = (tmp > 0 ? " +" : " ") + bet_result;
    diff.style.color = tmp > 0 ? "#2bdd2b" : "#ff4444";
    count(bet_number);
    cardVis[1].style.transform = "rotateY(0deg)";
    cardVis[1].style.boxShadow = "2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
    console.log(bet_result);
    setTimeout(() => {
      diff.innerText = "";
      end();
    }, 1500);
    canClickBIGorSMALL = false;
    canClickOPEN = false;
    updateDB(bet_result);
  }
});

function end() {
  // reset cardVis
  for (let i = 0; i < cardVis.length; i++) {
    cardVis[i].style.transform = "rotateY(-180deg)";
    cardVis[i].style.boxShadow = "-2px 1px 2px 1px rgba(0, 0, 0, 0.4)";
  }
  canClickCONFIRM = true;
  setTimeout(() => {
    gameover = true;
  }, 800);
}

function updateDB(bet_result) {
  var data = {
    bet_result: bet_result
  };
  fetch("./api/updateDB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}



