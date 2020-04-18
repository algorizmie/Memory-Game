const $table   = document.getElementById('table');
const $restart = document.getElementById('restart');
const $timer   = document.getElementById('timer');
const iconClass= ['fa-car', 'fa-bed', 'fa-truck', 'fa-umbrella', 'fa-coffee', 'fa-tree', 'fa-hashtag', 'fa-tachometer'];

let stimer       = null,
    preStart     = null,
    timer        = 20,
    compareCells = [],
    matchedCells = [],
    count        = 0,
    stopEvent    = false,
    shuffleArr   = [];

//Start of The game
init();
$restart.addEventListener('click', function (){
    reset();
    init();
});
function init() {
    shuffleArr       = shuffle(iconClass.concat(iconClass));
    const elements   = shuffleArr.map(createDom);
    $table.innerHTML = "";
    $timer.innerHTML = `Timer: ${timer}`;
    elements.forEach(el => $table.append(el));
    preLoader();
}

//Reset function
function reset() {
    timer        = 20;
    count        = 0;       
    compareCells = [],
    matchedCells = [],
    stopEvent    = false,
    clearInterval(preStart);
    stopTimer();
}

//Create DIV .cell
function createDom(item) {
    const square = document.createElement("div");
    square.classList.add("cell");
    square.innerHTML = `<i class="fa ${item}"></i>`;
    click(square);
    return square;
}
//Click event
function click(cell) {
    cell.addEventListener('click', function() {
        const $this = this;
        if($this.classList.contains('matched') || this.classList.contains('compared') || stopEvent)
            return;
        
        $this.classList.add("compared");
        $this.firstChild.style.display = 'inline-block';
        compareCells.push($this);

        if(compareCells.length == 2) {
            let firstCellClassList = compareCells[0].classList,
                LastCellClassList  = compareCells[1].classList,
                matched = compareCells[0].innerHTML == compareCells[1].innerHTML?true:false;
            stopEvent = true;
            if (matched) {
                firstCellClassList.remove('compared');
                LastCellClassList.remove('compared');
                firstCellClassList.add('matched');
                LastCellClassList.add('matched');
                stopEvent = false;
                compareCells = [];
                count++;
                win();
            } else {
                setTimeout(function() {
                    compareCells[0].firstChild.style.display = 'none';
                    compareCells[1].firstChild.style.display = 'none';
                    firstCellClassList.remove('compared');
                    LastCellClassList.remove('compared');
                    stopEvent = false;
                    compareCells = [];
                }, 500)
            }
        }
    })
}

//Pre Start
function preLoader() {
    var preTimer = 4;
    $table.appendChild(ovarly(preTimer));
    preStart = setInterval(function () {
        if(preTimer == 0) {
            hideIcons();
            startTimer();
            clearInterval(preStart);
            if($table.lastChild.classList.contains('ovarly'))
                $table.lastChild.remove();
            return;
        }
        preTimer--;
        $table.lastChild.innerHTML = preTimer;
    }, 1000);
}

//hide all Icones
function hideIcons(){
    const cells = document.getElementsByClassName('cell');
    for(let i = 0; i < cells.length; i++) {
        cells[i].firstChild.style.display = 'none';
    }
}
//Timer
function startTimer() {
    stimer = setInterval(function(){
        if(timer == 0) {
            gameOver();
            return;
        }
        timer--;
        $timer.innerHTML = `Timer: ${timer}`;
    }, 1000);
}

//Stop Timer
function stopTimer(){
    clearInterval(stimer);
}

//If Winner
function win() {
    if(count == 8) {
        stopTimer();
        $table.append(ovarly('Winner!'));
    }
}

//If Lost
function gameOver() {
    stopTimer();
    stopEvent = true;
    $table.append(ovarly('Game Over!'));
}

//Create Ovarly Div
function ovarly(msg) {
    const div = document.createElement('div');
    div.classList.add("ovarly");
    div.innerHTML = msg;
    return div;
}

//Source: https://stackoverflow.com/questions/2450954
function shuffle(array) {
    var currentIndex = array.length, 
    temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}