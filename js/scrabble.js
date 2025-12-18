/**********************************
 *  global variables/objects
 **********************************/

// board
let board = {};         // board object

board.slots = [    // array of references to board slots
    $('#board_slot0'), $('#board_slot1'), $('#board_slot2'), $('#board_slot3'), $('#board_slot4'),
    $('#board_slot5'), $('#board_slot6'), $('#board_slot7'), $('#board_slot8'), $('#board_slot9'),
    $('#board_slot10'), $('#board_slot11'), $('#board_slot12'), $('#board_slot13'), $('#board_slot14')
];

board.tiles = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

board.keys = [          // array to hold keys of tiles on board
    null, null, null, null, null, null, null, null,     
    null, null, null, null, null, null, null
];

board.keysToString = function() {       // format a string of keys in board.keys and print to console for debugging
    let str = "board keys: ";
    for (let i = 0; i < board.keys.length; i++) {
        str += board.keys[i] + " ";
    }

    console.log(str);
}

board.placements = 0;    // number of tiles currently placed on board

// rack
let rack = {};          // rack object

rack.slots = [     // array of references to rack slots
    $('#rack_slot0'), $('#rack_slot1'), $('#rack_slot2'), $('#rack_slot3'), 
    $('#rack_slot4'), $('#rack_slot5'), $('#rack_slot6')
]; 

rack.tiles = [null, null, null, null, null, null, null];    // array of references to original tile placement in rack

rack.keys = [null, null, null, null, null, null, null];     // array to hold keys of tiles on rack

rack.keysToString = function() {                        // format a string of keys in rack.keys and print to console for debugging
    let str = "rack keys: ";
    for (let i = 0; i < rack.keys.length; i++) {
        str += rack.keys[i] + " ";
    }
    console.log(str);
}

// bag
let bag = {};                   // bag object

bag.remaining = 100;        // total tiles at start of game

bag.tiles = ScrabbleTiles;  // reference to provided associative array

// game
let game = {}       // game object

game.total = 0;      // total score

game.firstWord = true;

/**********************************
 *  global functions
 **********************************/

function validateWord() {
    let status = 1, requireNothing = false, start = false, gap = false;

    // set css
    $("#status").css("color", "red");

    for (let i = 0; i < board.slots.length; i++) {
        if (board.slots[i].find(".tile").length > 0) {
            if (!start)
                start = true;   // word has begun
            if (requireNothing)
                status = -1; // found a gap in the word, return false
        } else {
            if (start) {
                requireNothing = true;  // end of word found, no other letters allowed
            }
        }
    }

    if (!start)
        status = -2; // no tiles on board

    return status;
}

function clearStatus() {
    $("#status").text("");
    // set color back to default red
    $("#status").css("color", "red");
}

function clearScoredWordsList() {
    // clear list
    $("#scoredWordsList").empty();
    // hide header
    $("#scoredWordsHeader").attr("style", "display: none;");
}

function clearBoard(full) {
    for (let i = 0; i < board.slots.length; i++) {
        board.tiles[i] = null;
        board.keys[i] = null;
        if (full)
            board.slots[i].empty();
        board.placements = 0;
    }
}

function clearRack(full) {
    for (let i = 0; i < rack.slots.length; i++) {
        rack.tiles[i] = null;
        rack.keys[i] = null;
        if (full)
            rack.slots[i].empty();
    }
}

function calculateScore() {
    // begin constructing word string
    let word = "";
    // determine bonus letters i=6,8
    let doubleKey1 = board.slots[6].find(".tile").attr("alt");
    let val1 = 0;
    let doubleKey2 = board.slots[8].find(".tile").attr("alt");
    let val2 = 0;
    console.log("double letters " + doubleKey1 + ", " + doubleKey2);
    if (doubleKey1 !== undefined) {
        val1 = bag.tiles[doubleKey1]["value"] * 2;
    }
    if (doubleKey2 !== undefined) {
        val2 = bag.tiles[doubleKey2]["value"] * 2;
    }
    // begin partial sum
    let partial = val1 + val2;
    // determine word multiplier i=2,12
    let wordMult = 1;
    let wordKey1 = board.slots[2].find(".tile").attr("alt");
    let wordKey2 = board.slots[12].find(".tile").attr("alt");
    if (wordKey1 !== undefined) {
        wordMult *= 2;
        // update partial sum
        partial += bag.tiles[wordKey1]["value"];
    }
    if (wordKey2 !== undefined) {
        wordMult *= 2;
        // update partial sum
        partial += bag.tiles[wordKey2]["value"];
    }
    // iterate through all regular slots
    let total = 0;
    for (let i = 0; i < board.slots.length; i++) {
        switch (i) {
            case 2:
                if (wordKey1 !== undefined) { word += wordKey1; }
                break;
            case 6:
                if (doubleKey1 !== undefined) { word += doubleKey1; }
                break;
            case 8:
                if (doubleKey2 !== undefined) { word += doubleKey2; }
                break;
            case 12:
                if (wordKey2 !== undefined) { word += wordKey2; }
                break;
            default:
                let curr = board.slots[i].find(".tile").attr("alt");
                if (curr !== undefined) {
                    total += bag.tiles[curr]["value"];
                    // append letter
                    word += curr;
                }
                break;
        }
    }
    // total
    total += partial;
    total *= wordMult;

    return {"score":total, "word":word};
}

function initSubmitButton() {
    $("#submit_button").on("click", function() {
        let status = validateWord();
        if (status === -1) {
            // word is not valid, there's a gap
            $("#status").text("Invalid Submission: There's a gap in the word. Be sure to only create words that place tiles adjacent to each other!");
            return; 
        } else if (status === -2) {
            // word is not valid, empty board
            $("#status").text("Invalid Submission: You can't submit an empty board! Try dragging and dropping tiles onto the board, or read the instructions if you're stuck!");
            return;
        } else {
            // word was valid, status === 1
            clearStatus();
        }

        // calculate the score
        let result = calculateScore();

        // pass to game object
        game.total += result.score;
        // display total
        $("#totalScore").text(game.total);
        // make new list item in scored word list
        let $li = $("<li>").text(result.word + " - " + result.score + " points");
        if (game.firstWord) {
            // set display to unset
            $("#scoredWordsHeader").attr("style", "display: unset;");
            game.firstWord = false;
        }
        // append to list
        $("#scoredWordsList").append($li);
        // clear board
        clearBoard(true);
        // update word potential 
        $("#potentialScore").text("0 points");
        // clear rack, do not trample unused tiles
        clearRack(false);
        // fill rack again
        populateRack();
        // re-initialize drag-and-drop functionality
        initDragDrop();
    });
}

function initReturnButton() {
    // set onclick listener
    $("#return_button").on("click", function() {
        // debug
        console.log("Returning tiles to bag...");
        // iterate through rack slots
        for (let i = 0; i < rack.slots.length; i++) {
            // move tile back to rack
            if (rack.tiles[i])
                rack.tiles[i].appendTo(rack.slots[i]);   // move tile back to original rack slot
        }
        // clear references
        clearBoard(true);
        // update UI
        let result = calculateScore();
        $("#potentialScore").text(result.score + " points");
    });
}

function initResetButton() {
    $("#reset_button").on("click", function() {
        // debug
        console.log("Resetting game...");
        // iterate through associative array and reset number-remaining
        for (let key in bag.tiles) {
            bag.tiles[key]["number-remaining"] = bag.tiles[key]["original-distribution"];
        }
        // reset total remaining in bag
        bag.remaining = 100;
        // reset game total
        game.total = 0;
        // update total on screen;
        $("#totalScore").text(game.total);
        // clear scored words list
        clearScoredWordsList();
        // reset firstWord flag
        game.firstWord = true;
        // clear board
        clearBoard(true);
        // clear rack
        clearRack(true);
        // clear status
        clearStatus();
        // populate rack again
        populateRack();
        // re-initialize drag-and-drop functionality
        initDragDrop();
    });
}   

function initPassButton() {
    $("#pass_button").on("click", function() {
        // debug
        console.log("Passing turn...");
        // clear board
        clearBoard(true);
        // clear rack, trample unused tiles
        clearRack(true);
        // clear status
        clearStatus();
        // fill rack again
        populateRack();
        // re-initialize drag-and-drop functionality
        initDragDrop();
    });
}

function initButtonCallbacks() {
    // submit word listener
    initSubmitButton();
    // return tiles listener
    initReturnButton();
    // reset game listener
    initResetButton();
    // pass turn listener
    initPassButton();
}

function dragStartHandler(ev) {
    // copy the id of the <img> element (the tile)
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {
    // just prevent default behaviors
    ev.preventDefault();
    ev.originalEvent.preventDefault();
}

function dropHandler(ev) {
    // prevent default behaviors
    ev.preventDefault();
    ev.originalEvent.preventDefault();

    // retrieve the id of the <img>
    const id = ev.originalEvent.dataTransfer.getData("text");
    // retrive the actual <img> from id using DOM
    const tile = document.getElementById(id);
    // get the target slot
    const slot = ev.target.closest(".slot");
    // if failure to get either, just return and reject drop
    if (!slot || !tile) return;

    if (slot.querySelector(".tile")) {
        // there's already a tile there, reject drop
        console.log("slot already occupied by tile");
        return;
    }

    // check if slot to the left of target has a tile
    for (let i = 0; i < board.slots.length; i++) {
        if (board.slots[i][0] === slot) {       // [0] to get DOM element from jQuery object
            // found the slot on board, check left slot
            if (i > 0 && !board.slots[i - 1][0].querySelector(".tile") && board.placements > 0) {
                console.log("left slot is empty, rejecting drop");
                return;
            }
            break;
        } else if (i < rack.slots.length && rack.slots[i][0] === slot) {
            // found the slot on rack, no need to check left slot
            break;
        }
    }

    slot.appendChild(tile);

    // remove tile from previous location in rack or board if necessary
    let indexB = board.tiles.indexOf(tile);
    let indexR = rack.tiles.indexOf(tile);
    if (indexB !== -1) {
        // tile was on board, remove it
        board.tiles[indexB] = null;
        console.log("removed tile from board slot " + indexB);
        board.placements--;
    }
    if (indexR !== -1) {
        // tile was on rack, remove it
        rack.tiles[indexR] = null;
        console.log("removed tile from rack slot " + indexR);
    }

    // store tile in board.tiles
    for (let i = 0; i < board.slots.length; i++) {
        if (board.slots[i][0] === slot) {       // [0] to get DOM element from jQuery object
            // found the slot on board
            board.tiles[i] = tile;
            console.log("placed tile " + tile.alt + " on board slot " + i);
            board.placements++;
            break;
        } else if (i < rack.slots.length && rack.slots[i][0] === slot) {
            // found the slot on rack
            rack.tiles[i] = tile;
            console.log("placed tile " + tile.alt + " on rack slot " + i);
            break;
        }
    }

    // dynamically calculate score
    let result = calculateScore();
    $("#potentialScore").text(result.score + " points");

}

// apply all the necessary handlers to implement drag-and-drop functionality
function initDragDrop() {
    // implementations from https://www.w3schools.com/html/html5_draganddrop.asp
    // set onDragStart
    $(".tile").on("dragstart", dragStartHandler);
    
    if (game.firstWord) {
        // set onDragOver
        $(".slot").on("dragover", dragoverHandler);
        // set onDrop
        $(".slot").on("drop", dropHandler);
    }
}

// get a random letter from ScrabbleTiles
function randomTile() {
    // get a random number between 0 and bag.tiles - 1
    let randomIndex = Math.floor(Math.random() * bag.remaining);

    // check if 0 tiles left
    if (bag.remaining <= 0) {
        return "NO TILES";
    }

    console.log("got random tile index: " + randomIndex);

    // iterate through bag.tiles to find the letter
    for (let key in bag.tiles) {
        if (randomIndex - bag.tiles[key]["number-remaining"] <= 0) {
            // found the letter
            console.log("selected tile: " + key);
            return key;
        } else {
            // subtract and iterate
            randomIndex -= bag.tiles[key]["number-remaining"];
        }
    }
}

// populate rack with initial tiles
function populateRack() {
    console.log("populating the player's rack with tiles")
    for (let i = 0; i < rack.slots.length; i++) {
        if (rack.slots[i].find(".tile").length > 0) {
            // slot already occupied, skip
            console.log("rack slot " + i + " already occupied, adding to rack.tiles and skipping");
            rack.tiles[i] = rack.slots[i].find(".tile");
            continue;
        }

        // get a random letter from ScrabbleTiles
        let key = randomTile();
        if (key === "NO TILES") {
            // check if 0 tiles in back and rack
            if (bag.remaining === 0) {
                let empty = true;
                for (let i = 0; i < rack.slots.length; i++) {
                    if (rack.slots[i].find(".tile").length > 0) {
                        empty = false;
                        break;
                    }
                }
                if (empty) {
                    $("#status").text("Gameover! You've run out of tiles, thanks for playing!").css("color", "green");
                }
            }
            // break out of the loop
            break;
        }
        // make a new img element for the tile
        let $tile = $("<img>")
            .addClass("tile")
            .attr("id", "rack_tile" + i)
            .attr("src", "images/Scrabble_Tiles/" + bag.tiles[key]["img"])
            .attr("alt", key)
            .prop("draggable", true);
        // place the tile in the corresponding slot
        const slotStr = "#rack_slot" + i;
        $(slotStr).append($tile);
        // decrement the number-remaining for that letter
        bag.tiles[key]["number-remaining"]--;
        // decrement the total remaining in the bag
        bag.remaining--;
        // store the key in the rack.keys array
        rack.keys[i] = key;
        // store the tile in rack.tiles
        rack.tiles[i] = $("#rack_tile" + i);
        
        // debug output
        console.log("placed " + key + " on rack pos " + i + ", new num remaining: " + bag.tiles[key]["number-remaining"] );
    }
    // update tiles in bag
    $("#tilesRemaining").text(bag.remaining);
}

 /**********************************
 *  main program driver
 **********************************/
$(document).ready(function() {
    // fill the rack with 7 new tiles from the bag
    populateRack();
    // initialize drag-and-drop functionality, setting listeners
    initDragDrop();
    // initialize UI button callbacks
    initButtonCallbacks();
});