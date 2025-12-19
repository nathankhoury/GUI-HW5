/*
File:           scrabble.js
Class:          COMP 4610 GUI Programming I
Assignment:     HW5 , "Implementing a Bit of Scrabble with Drag-and-Drop" i.e. "One-Line Scrabble"
Name:           Nathan Khoury
Created:        12/15/2025
Last Modified:  12/19/2025

Description:    ALl of my authored code managing the game state and UI interactions for
                the One-Line Scrabble assignment.  Implements drag-and-drop functionality
                using the HTML5 Drag and Drop API, along with game logic for tile selection,
                dynamic score calculation, tile management, and button callbacks. Several objects
                are defined to intuitively encapsulate the board, rack, bag, and game state. 
*/
/**********************************
 *  global variables/objects
 **********************************/

// board
let board = {};         // board object

board.slots = [         // array of references to board slots
    $('#board_slot0'), $('#board_slot1'), $('#board_slot2'), $('#board_slot3'), $('#board_slot4'),
    $('#board_slot5'), $('#board_slot6'), $('#board_slot7'), $('#board_slot8'), $('#board_slot9'),
    $('#board_slot10'), $('#board_slot11'), $('#board_slot12'), $('#board_slot13'), $('#board_slot14')
];

board.tiles = [         // array of references to tile placement on board
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
];                         
board.placements = 0;   // number of tiles currently placed on board

// rack
let rack = {};          // rack object

rack.slots = [          // array of references to rack slots
    $('#rack_slot0'), $('#rack_slot1'), $('#rack_slot2'), $('#rack_slot3'), 
    $('#rack_slot4'), $('#rack_slot5'), $('#rack_slot6')
]; 

rack.tiles = [null, null, null, null, null, null, null];    // array of references to tile placement in rack

// bag
let bag = {};               // bag object

bag.remaining = 100;        // total tiles at start of game

bag.tiles = ScrabbleTiles;  // reference to provided associative array

// game 
let game = {};              // game object

game.total = 0;             // total score

game.firstWord = true;      // boolean flag for first word submission

/**********************************
 *  global functions
 **********************************/

// check if the word on the board is valid (no gaps, at least one tile)
// returns: 1 if valid, -1 if gap found, -2 if no tiles on board
//   types: Integer
function validateWord() {
    let status = 1, requireNothing = false, start = false, gap = false;

    // set css to red, in case it was changed to green previously
    $("#status").css("color", "red");

    for (let i = 0; i < board.slots.length; i++) {          // for each board slot
        if (board.slots[i].find(".tile").length > 0) {      // check if a tile is present
            if (!start)                                 // first tile found
                start = true;                           // word has begun
            if (requireNothing)                         
                status = -1;                            // found a gap in the word, return false
        } else {
            if (start) {                            // word has started, but no tile found
                requireNothing = true;              // end of word found, no other letters allowed
            }
        }
    }

    if (!start)                 // if word never started
        status = -2;            // no tiles on board

    return status;              // return status number
}

// clear the status message div
function clearStatus() {
    $("#status").text("");              // clear text
    $("#status").css("color", "red");   // set color back to default red
}

// clear the scored words list ul
function clearScoredWordsList() {
    $("#scoredWordsList").empty();                              // clear list
    $("#scoredWordsHeader").attr("style", "display: none;");    // hide header
}

// clear the board tiles
// if full is true, also empty the slots of any tiles ("full" clear)
function clearBoard(full) {
    for (let i = 0; i < board.slots.length; i++) {      // for each board slot
        board.tiles[i] = null;              // clear tile reference
        if (full)                           // if full clear
            board.slots[i].empty();         // then empty the slot of any tile
    }

    board.placements = 0;                   // reset placements count
}

// clear the rack tiles
// if full is true, also empty the slots of any tiles ("full" clear)
function clearRack(full) {
    for (let i = 0; i < rack.slots.length; i++) {       // for each rack slot
        rack.tiles[i] = null;               // clear tile reference
        if (full)                           // if full clear
            rack.slots[i].empty();          // then empty the slot of any tile
    }
}

// return the score yielded by the current word on the board, and the word as a string
// returns: {"score":total, "word":word}
//   types: {Integer, String}
function calculateScore() {
    // begin constructing word string
    let word = "";

    // determine bonus letters i=6,8
    let doubleKey1 = board.slots[6].find(".tile").attr("alt");  // key for tile on first double letter slot
    let val1 = 0;                                               // value for first double letter tile, 0 if none
    let doubleKey2 = board.slots[8].find(".tile").attr("alt");  // key for tile on second double letter slot
    let val2 = 0;                                               // value for second double letter tile, 0 if none
    console.log("double letters " + doubleKey1 + ", " + doubleKey2);

    if (doubleKey1 !== undefined) {                     // if first double letter present
        val1 = bag.tiles[doubleKey1]["value"] * 2;      // store double its value
    }

    if (doubleKey2 !== undefined) {                     // if second double letter present
        val2 = bag.tiles[doubleKey2]["value"] * 2;      // store double its value
    }

    // begin partial sum
    let partial = val1 + val2;                          // sum of double letter bonuses

    // determine word multiplier i=2,12
    let wordMult = 1;                                   // multiplier starts at 1
    let wordKey1 = board.slots[2].find(".tile").attr("alt");    // key for tile on first word double slot
    let wordKey2 = board.slots[12].find(".tile").attr("alt");   // key for tile on second word double slot

    if (wordKey1 !== undefined) {                   // if first double word tile present
        wordMult *= 2;                              // double the word multiplier
        // update partial sum
        partial += bag.tiles[wordKey1]["value"];    // add its value to the partial sum
    }

    if (wordKey2 !== undefined) {                   // if second double word tile present
        wordMult *= 2;                              // double the word multiplier
        // update partial sum
        partial += bag.tiles[wordKey2]["value"];    // add its value to the partial sum
    }

    // iterate through all regular slots
    let total = 0;
    for (let i = 0; i < board.slots.length; i++) {
        switch (i) {    // find the slots we already handled to append their letters to the string
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
                let curr = board.slots[i].find(".tile").attr("alt");    // get current tile key
                if (curr !== undefined) {                               // if tile present
                    total += bag.tiles[curr]["value"];          // add its value to total
                    word += curr;                               // append letter to word string
                }
                break;
        }
    }

    // total
    total += partial;   // add partial sum
    total *= wordMult;  // apply word multiplier

    return {"score":total, "word":word};    // return tuple
}

// initialize the callback behavior for the submit button
// validates the word, calculates score, updates game state and UI
function initSubmitButton() {
    $("#submit_button").on("click", function() {
        console.log("Resetting game...");       // debug

        let status = validateWord();            // validate the word on the board
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
        let $li = $("<li>").text(result.word + " - " + result.score + " points");   // construct new li
        if (game.firstWord) {                                           // if first word of game
            // set display to unset
            $("#scoredWordsHeader").attr("style", "display: unset;");   // show header
            game.firstWord = false;                                     // unset firstWord flag
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

// initialize the callback behavior for the return button
// moves all tiles from board back to rack
function initReturnButton() {
    $("#return_button").on("click", function () {
        console.log("Returning tiles to rack...");      // debug

        // collect all tiles currently on the board
        const tilesOnBoard = $("#board .tile").toArray();

        // move them back to rack, left to right
        tilesOnBoard.forEach(tile => {                          // for each tile on board
            for (let i = 0; i < rack.slots.length; i++) {       // iterate through rack slots
                if (rack.slots[i].find(".tile").length === 0) { // if slot is empty
                    rack.slots[i].append(tile);                 // move tile to rack slot
                    break;                              // break out of inner loop once placed
                }
            }
        });

        // reset board state safely
        board.tiles.fill(null);
        board.placements = 0;

        // update score preview
        let result = calculateScore();
        $("#potentialScore").text(result.score + " points");
    });
}

// initialize the callback behavior for the reset button
// resets the entire game state back to initial conditions
function initResetButton() {
    $("#reset_button").on("click", function() {
        console.log("Resetting game...");    // debug

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

// initialize the callback behavior for the pass button
// passes the turn, clears board and rack, refills rack
function initPassButton() {
    $("#pass_button").on("click", function() {
        console.log("Passing turn...");     // debug

        // clear board
        clearBoard(true);

        // clear rack, waste unused tiles
        clearRack(true);

        // clear status
        clearStatus();

        // fill rack again
        populateRack();

        // re-initialize drag-and-drop functionality
        initDragDrop();
    });
}

// initialize all button callbacks
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

// drag start handler
// stores the id of the dragged tile in dataTransfer object
function dragStartHandler(ev) {
    // copy the id of the <img> element (the tile)
    ev.originalEvent.dataTransfer.setData("text", ev.target.id);
}

// drag over handler
// prevents default behavior to allow drop
function dragoverHandler(ev) {
    // just prevent default behaviors
    ev.preventDefault();
    ev.originalEvent.preventDefault();
}

// drop handler
// handles the drop event, moving the tile to the target slot if valid
function dropHandler(ev) {
    // prevent default behaviors
    ev.preventDefault();
    ev.originalEvent.preventDefault();

    // retrieve the id of the <img>
    const id = ev.originalEvent.dataTransfer.getData("text");

    // retrieve the actual <img> from id using DOM
    const tile = document.getElementById(id);

    // get the target slot
    const slot = ev.target.closest(".slot");

    // if failure to get either, just return and reject drop
    if (!slot || !tile) return;

    if (slot.querySelector(".tile")) {  // check if slot is empty...
        // there's already a tile there, reject drop
        console.log("slot already occupied by tile");
        return;
    }

    // check if slot to the left of target has a tile
    for (let i = 0; i < board.slots.length; i++) {  // for each board slot
        if (board.slots[i][0] === slot) {           // [0] to get DOM element from jQuery object
            // found the slot on board, check left slot
            if (i > 0 && !board.slots[i - 1][0].querySelector(".tile") && board.placements > 0) {
                // left slot is empty and there are other tiles on board, reject drop
                console.log("left slot is empty, rejecting drop");
                return;
            }
            break;      // break out of loop
        } else if (i < rack.slots.length && rack.slots[i][0] === slot) {
            // found the slot on rack, no need to check left slot
            break;
        }
    }

    // all checks passed, actually execute the drop
    slot.appendChild(tile);

    // remove tile from previous location in rack or board if necessary
    let indexB = board.tiles.indexOf(tile);   // check if tile was on board
    let indexR = rack.tiles.indexOf(tile);    // check if tile was on rack
    if (indexB !== -1) {
        // tile was on board, remove it
        board.tiles[indexB] = null;                             // nullify reference
        console.log("removed tile from board slot " + indexB);  // debug
        board.placements--;                                     // decrement placements count
    }
    if (indexR !== -1) {
        // tile was on rack, remove it
        rack.tiles[indexR] = null;                              // nullify reference
        console.log("removed tile from rack slot " + indexR);   // debug
    }

    // store tile in board.tiles
    for (let i = 0; i < board.slots.length; i++) {  // for each board slot
        if (board.slots[i][0] === slot) {           // if target slot is a board slot
            // found the slot on board
            board.tiles[i] = tile;                                          // store tile reference
            console.log("placed tile " + tile.alt + " on board slot " + i); // debug
            board.placements++;                                             // increment placements count
            break;
        } else if (i < rack.slots.length && rack.slots[i][0] === slot) {    // if target slot is a rack slot
            // found the slot on rack
            rack.tiles[i] = tile;                                           // store tile reference
            console.log("placed tile " + tile.alt + " on rack slot " + i);  // debug
            break;
        }
    }

    // dynamically calculate and update score for player
    let result = calculateScore();
    $("#potentialScore").text(result.score + " points");

}

// initialize drag-and-drop functionality by setting event listeners
// sets onDragStart, onDragOver, onDrop
function initDragDrop() {
    // implementations referenced from https://www.w3schools.com/html/html5_draganddrop.asp
    $(".tile").on("dragstart", dragStartHandler);   // set onDragStart
    
    // only on first word of the game
    if (game.firstWord) {
        $(".slot").on("dragover", dragoverHandler); // set onDragOver
        $(".slot").on("drop", dropHandler);         // set onDrop
    }
}

// get a random letter from ScrabbleTiles
// returns: key of selected letter
//   types: String
function randomTile() {
    // get a random number between 0 and bag.tiles - 1
    let randomIndex = Math.floor(Math.random() * bag.remaining);

    // check if 0 tiles left
    if (bag.remaining <= 0) {   // if no tiles left
        return "NO TILES";      // return "NO TILES" rather than a key
    }

    console.log("got random tile index: " + randomIndex);       // debug

    // iterate through bag.tiles to find the letter
    for (let key in bag.tiles) {                                // for each key in bag.tiles
        if (randomIndex - bag.tiles[key]["number-remaining"] <= 0) {    // decrement number-remaining, if <= 0 we've found the letter
            // found the letter
            console.log("selected tile: " + key);               // debug
            return key;                                         // return key
        } else {                                                // else
            randomIndex -= bag.tiles[key]["number-remaining"];  // subtract and iterate
        }
    }
}

// fill all empty rack slots with random tiles from the bag
function populateRack() {
    console.log("populating the player's rack with tiles")  // debug
    for (let i = 0; i < rack.slots.length; i++) {           // for each rack slot
        if (rack.slots[i].find(".tile").length > 0) {       // if there is a tile
            // slot already occupied, skip
            console.log("rack slot " + i + " already occupied, adding to rack.tiles and skipping"); // debug
            rack.tiles[i] = rack.slots[i].find(".tile");    // store tile in rack.tiles
            continue;                                       // skip to next iteration
        }

        // get a random letter from ScrabbleTiles
        let key = randomTile();                         // get random tile key
        if (key === "NO TILES") {                       // if no tiles status
            // check if 0 tiles in back and rack
            if (bag.remaining === 0) {                  // verify with bag
                let empty = true;                       // check if rack is empty
                for (let i = 0; i < rack.slots.length; i++) {       // for each rack slot
                    if (rack.slots[i].find(".tile").length > 0) {   // if there is a tile
                        empty = false;                              // rack is not empty
                        break;                          // break out of loop
                    }
                }
                if (empty) {                            // if rack is empty
                    // end game message
                    $("#status").text("Game Over! You've run out of tiles, thanks for playing!").css("color", "green");
                }
            }
            // break out of the loop
            break;
        }

        // make a new img element for the tile
        let $tile = $("<img>")                                              // create img element in jquery
            .addClass("tile")                                               // add tile class
            .attr("id", "rack_tile" + i)                                    // set id
            .attr("src", "images/Scrabble_Tiles/" + bag.tiles[key]["img"])  // set img src
            .attr("alt", key)                                               // set alt to letter key
            .prop("draggable", true);                                       // make draggable

        // place the tile in the corresponding slot
        const slotStr = "#rack_slot" + i;                   // construct slot id string    
        $(slotStr).append($tile);                           // append tile to slot

        // decrement the number-remaining for that letter
        bag.tiles[key]["number-remaining"]--;

        // decrement the total remaining in the bag
        bag.remaining--;

        // store the tile in rack.tiles
        rack.tiles[i] = $("#rack_tile" + i);
        
        // debug
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