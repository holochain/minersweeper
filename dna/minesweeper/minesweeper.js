

/*=============================================
=            Public Zome Functions            =
=============================================*/

function newGame(payload) {
  var text = payload.text;
  var size = payload.gameParams.size;
  var nMines = payload.gameParams.nMines;

  var gameBoard = genGameBoard(text, size, nMines);
  // bundleStart(1, "");
  var gameHash = commit('gameBoard', gameBoard);
  commit('actionLinks', { Links: [ 
    { Base: makeHash('anchor', 'currentGames'), Link: gameHash, Tag: "" } ] 
  });  
  // bundleClose(true);
  return gameHash;
}

function makeMove(payload) {
  var gameHash = payload.gameHash;
  var action = payload.move;

  // bundleStart(1, "");
  var actionHash = commit('action', action);
  commit('actionLinks', { Links: [ 
    { Base: gameHash, Link: actionHash, Tag: "" } ] 
  });
  // bundleClose(true);
}

function getCurrentGames() {
  debug(makeHash('anchor', 'currentGames'));
  return getLinks(makeHash('anchor', 'currentGames'), "", {Load: true});
}

function getState(payload) {
  var gameHash = payload.gameHash;
  return getLinks(gameHash, "", {Load: true});
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
    var x = randInt(0, size.x);
    var y = randInt(0, size.y);  
    mines.push({x:x, y:y});
  }

  return {
    mines: mines,
    size: size, 
    text: text
  };
}


/*=====  End of Private Functions  ======*/



/*==========================================
=            Required Callbacks            =
==========================================*/

function genesis () {
  var h = commit('anchor', 'currentGames'); // ensure this always exists
  debug(h)
  return true;
}


function validatePut(entry_type, entry, header, pkg, sources) {
  return validateCommit(entry_type, entry, header, pkg, sources);
}
function validateCommit(entry_type, entry, header, pkg, sources) {
  return true;
}

function validateLink(linkingEntryType, baseHash, linkHash, pkg, sources) {
  return true;
}
function validateMod(entry_type, hash, newHash, pkg, sources) {
  return true;
}
function validateDel(entry_type, hash, pkg, sources) {
  return true;
}
function validatePutPkg(entry_type) {
  return null;
}
function validateModPkg(entry_type) {
  return null;
}
function validateDelPkg(entry_type) {
  return null;
}
function validateLinkPkg(entry_type) {
  return null;
}

function validateLink(entryType, hash, links, pkg, sources) {
  return true;
}

function validateDelPkg(entryType) {
  return null;
}


/*=====  End of Required Callbacks  ======*/
