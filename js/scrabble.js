/**********************************
 *  global variables/objects
 **********************************/
// board object
let board = {};
// array of references to board slots
board.references = [
    $('#slot0'), $('#slot1'), $('#slot2'), $('#slot3'), $('#slot4'),
    $('#slot5'), $('#slot6'), $('#slot7'), $('#slot8'), $('#slot9'),
    $('#slot10'), $('#slot11'), $('#slot12'), $('#slot13'), $('#slot14')
];
// array to hold keys of tiles placed on board
board.keys = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
board.keysToString = function() {
    let str = "board keys: ";
    for (let i = 0; i < board.keys.length; i++) {
        str += board.keys[i] + " ";
    }
    console.log(str);
}

// rack object
let rack = {};
// array of references to rack tiles
rack.references = [
    $('#tile0'), $('#tile1'), $('#tile2'), $('#tile3'), 
    $('#tile4'), $('#tile5'), $('#tile6')
];
// array to hold keys of tiles on rack
rack.keys = [null, null, null, null, null, null, null];
rack.keysToString = function() {
    let str = "rack keys: ";
    for (let i = 0; i < rack.keys.length; i++) {
        str += rack.keys[i] + " ";
    }
    console.log(str);
}

// bag object
bag = {};
bag.remaining = 100;        // total tiles at start of game
bag.tiles = ScrabbleTiles;  // reference to provided associative array


/**********************************
 *  global functions
 **********************************/


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
            randomIndex -= bag.tiles[key]["number-remaining"];
        }
    }
}

// populate rack with initial tiles
function populateRack() {
    console.log("populating the player's rack with tiles")
    for (let i = 0; i < rack.references.length; i++) {
        // get a random letter from ScrabbleTiles
        let key = randomTile();
        // set the image source
        rack.references[i].css("background-image", "url('../images/Scrabble_Tiles/" + bag.tiles[key]["img"] + "')");
        // decrement the number-remaining for that letter
        bag.tiles[key]["number-remaining"]--;
        // decrement the total remaining in the bag
        bag.remaining--;
        // store the key in the rack.keys array
        rack.keys[i] = key;

        console.log("placed " + key + " on rack pos " + i + ", new num remaining: " + bag.tiles[key]["number-remaining"] );
    }
}

 /**********************************
 *  main program driver
 **********************************/
$(document).ready(function() {
    populateRack();
    rack.keysToString();
});