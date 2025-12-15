/*  File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 *  updated by Nathan Khoury (myself) on 12/15/2025 at 3:00 PM to add image file names as properties
 *    as well as letter property for access to what the letter actually is
 */
 
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9,  "img" : "Scrabble_Tile_A.jpg", "letter" : "A" };
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_B.jpg", "letter" : "B" };
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_C.jpg", "letter" : "C" };
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4,  "img" : "Scrabble_Tile_D.jpg", "letter" : "D" };
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12, "img" : "Scrabble_Tile_E.jpg", "letter" : "E" };
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_F.jpg", "letter" : "F" };
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3,  "img" : "Scrabble_Tile_G.jpg", "letter" : "G" };
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_H.jpg", "letter" : "H" };
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9,  "img" : "Scrabble_Tile_I.jpg", "letter" : "I" };
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1,  "img" : "Scrabble_Tile_J.jpg", "letter" : "J" };
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1,  "img" : "Scrabble_Tile_K.jpg", "letter" : "K" };
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4,  "img" : "Scrabble_Tile_L.jpg", "letter" : "L" };
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_M.jpg", "letter" : "M" };
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6,  "img" : "Scrabble_Tile_N.jpg", "letter" : "N" };
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8,  "img" : "Scrabble_Tile_O.jpg", "letter" : "O" };
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_P.jpg", "letter" : "P" };
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1,  "img" : "Scrabble_Tile_Q.jpg", "letter" : "Q" };
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6,  "img" : "Scrabble_Tile_R.jpg", "letter" : "R" };
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4,  "img" : "Scrabble_Tile_S.jpg", "letter" : "S" };
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6,  "img" : "Scrabble_Tile_T.jpg", "letter" : "T" };
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4,  "img" : "Scrabble_Tile_U.jpg", "letter" : "U" };
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_V.jpg", "letter" : "V" };
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_W.jpg", "letter" : "W" };
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1,  "img" : "Scrabble_Tile_X.jpg", "letter" : "X" };
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_Y.jpg", "letter" : "Y" };
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1,  "img" : "Scrabble_Tile_Z.jpg", "letter" : "Z" };
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2,  "img" : "Scrabble_Tile_Blank.jpg", "letter" : "_" };