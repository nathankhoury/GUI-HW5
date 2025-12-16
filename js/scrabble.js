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
bag = {};                   // bag object

bag.remaining = 100;        // total tiles at start of game

bag.tiles = ScrabbleTiles;  // reference to provided associative array


/**********************************
 *  global functions
 **********************************/

function initSubmitButton() {
    // stub function for submit button
}

function initReturnButton() {
    // set onclick listener
    $("#return_button").on("click", function() {
        // debug
        console.log("Returning tiles to bag...");
        // iterate through rack slots
        for (let i = 0; i < rack.slots.length; i++) {
            // move tile back to rack
            rack.tiles[i].appendTo(rack.slots[i]);   // move tile back to original rack slot
        }
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
        // clear board
        for (let i = 0; i < board.slots.length; i++) {
            board.tiles[i] = null;
            board.keys[i] = null;
            board.slots[i].empty();
        }
        // clear rack
        for (let i = 0; i < rack.slots.length; i++) {
            rack.tiles[i] = null;
            rack.keys[i] = null;
            rack.slots[i].empty();
        }
        // populate rack again
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

    slot.appendChild(tile);
}

// apply all the necessary handlers to implement drag-and-drop functionality
function initDragDrop() {
    // implementations from https://www.w3schools.com/html/html5_draganddrop.asp
    // set onDragStart
    $(".tile").on("dragstart", dragStartHandler);
    // set onDragOver
    $(".slot").on("dragover", dragoverHandler);
    // set onDrop
    $(".slot").on("drop", dropHandler);
}

// get a random letter from ScrabbleTiles
function randomTile() {
    // get a random number between 0 and bag.tiles - 1
    let randomIndex = Math.floor(Math.random() * bag.remaining);

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
        // get a random letter from ScrabbleTiles
        let key = randomTile();
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