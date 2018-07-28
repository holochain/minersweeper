

/*=============================================
=            Public Zome Functions            =
=============================================*/

function newGame(payload) {
  var text = payload.text;
  var size = payload.size;
  var nMines = payload.nMines;

  var gameBoard = genGameBoard(text, size, nMines);
  bundleStart(1);
  var gameHash = commit('gameBoard', gameBoard);
  commit('actionLinks', { Links: [ 
    { Base: makeHash('anchor', 'currentGames'), Link: gameHash, Tag: "" } ] 
  });  
  bundleClose(true);
}

function makeMove(payload) {
  var gameHash = payload.gameHash;
  var action = payload.move;

  bundleStart(1);
  var actionHash = commit('action', action);
  commit('actionLinks', { Links: [ 
    { Base: gameHash, Link: actionHash, Tag: "" } ] 
  });
  bundleClose(true);
}

function getCurrentGames() {
  return getLinks(makeHash('anchor', 'currentGames'), {Load: true});
}

function getState(payload) {
  var gameHash = payload.gameHash;
  return getLinks(gameHash, {Load: true});
}

/*=====  End of Public Zome Functions  ======*/


/*=========================================
=            Private Functions            =
=========================================*/

//Returns a random integer between min (inclusive) and max (inclusive)
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function genGameBoard(text, size, nMines) {
  var mines = [];
  
  for(var i = 0; i < nMines; i++) {
    do {
      var x = randInt(0, size.x);
      var y = randInt(0, size.y);  
    } while (!mines.some(function(elem) {
      return x === elem.x && x === elem.y;
    }))
    mines.push({x:x, y:y})
  }

  return {
    mines: mines,
    size: size, 
    text: text
  }
}


/*=====  End of Private Functions  ======*/



/*==========================================
=            Required Callbacks            =
==========================================*/

function genesis () {
  commit('anchor', 'currentGames'); // ensure this always exists
  return true;
}


function validateCommit (entryType, entry, header, pkg, sources) {
  return true;
}


function validatePut (entryType, entry, header, pkg, sources) {
  return true;
}

function validateLink(entryType, hash, links, pkg, sources) {
  return true;
}


function validateMod (entryType, entry, header, replaces, pkg, sources) {
  return true;
}


function validateDel (entryType, hash, pkg, sources) {
  return true;
}


function validatePutPkg (entryType) {
  return null;
}


function validateModPkg (entryType) {
  return null;
}


function validateDelPkg (entryType) {
  return null;
}

function validateLinkPkg(entryType) {
  return null;
}

/*=====  End of Required Callbacks  ======*/
