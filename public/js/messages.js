// This is a simple example of a way to send messages between players (to update the game for example)
// It can be imporved changing the order of events to adapt it to the needs of the final game

// Local information like the Transform of the character
var local;
// Full gamestate with the information of every player
var gameState;

if(!window.isHead){
    // This will send anything (like a JSON) to the Head of the room
    // In this case it sends the local information
    sendLocalUpdate(local);
} else {
    // After implementing the logic of the final game, the head will interpret that information and send the new gameState to the rest of the players
    broadcast(gameState);
}

if(window.isHead){
    // Here the Head of the room will modify the gameState with all of the information recieved in the previous frame
    // 
    // 
    //
    ////////////////////////////////////////////////////////////////
}

// This file is an example and it's not implemented in the rooms of this proyect