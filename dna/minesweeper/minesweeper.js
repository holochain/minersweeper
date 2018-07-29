
var MAX_MINE_FRACTION = 0.5 // maximum fraction of the board that may be covered in mines

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
  commit('gameLinks', { Links: [ 
    { Base: makeHash('anchor', 'currentGames'), Link: gameHash, Tag: "" } ] 
  });  
  // bundleClose(true);
  return gameHash;
}

function makeMove(payload) {
  var gameHash = payload.gameHash;
  var action = payload.move;
  action.agentHash = App.Key.Hash;

  // bundleStart(1, "");
  var actionHash = commit('action', action);
  commit('actionLinks', { Links: [ 
    { Base: gameHash, Link: actionHash, Tag: "" } ] 
  });
  // bundleClose(true);
  return actionHash;
}

function getCurrentGames() {
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

var seed = 420;

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Returns a random integer between min (inclusive) and max (inclusive)
function randInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}


function genGameBoard(text, size, nMines) {
  var mines = [];
  for(var i = 0; i < nMines; i++) {
    do {
      var x = randInt(0, size.x);
      var y = randInt(0, size.y);  
    } while (mines.some(function(elem) { // ensures no duplicates
      return (x===elem.x && y===elem.y)
    }));
    mines.push({x:x, y:y});
  }

  return {
    mines: mines,
    size: size, 
    text: text
  };
}

// player is dead if one of their reveals is a mine position
function isDead(gameBoard, actions) {
  debug(gameBoard)
  debug(actions)
  return gameBoard.mines.some(function (mine) {
    return actions.some(function(action) {
      if(action.actionType === "reveal") {
        return (action.position.x === mine.x && action.position.y === mine.y);
      } else {
        return false;
      }
    });
  });
}

/*=====  End of Private Functions  ======*/

/*============================================
=            Validation functions            =
============================================*/

// the main validation function of the game. All game rules are enforced here
function validateAddAction(gameHash, actionHash, agentHash) {
  var gameBoard = get(gameHash);
  var actions = getLinks(gameHash, "", {Load: true}).map(function(elem) {
    return elem.Entry;
  });
  var actionsFromAgent = actions.filter(function(action) {
    return action.agentHash === agentHash;
  });
  return !isDead(gameBoard, actionsFromAgent);
}

// ensures a game board is valid before it can be added
function validateGameBoard(gameBoard) {
  debug(gameBoard);
  return gameBoard.size.x > 10 && gameBoard.size.y > 10 && gameBoard.mines.length < MAX_MINE_FRACTION*(gameBoard.size.x*gameBoard.size.y);
}

/*=====  End of Validation functions  ======*/


/*==========================================
=            Required Callbacks            =
==========================================*/

function genesis () {
  var h = commit('anchor', 'currentGames'); // ensure this always exists
  return true;
}

function validatePut(entry_type, entry, header, pkg, sources) {
  return validateCommit(entry_type, entry, header, pkg, sources);
}

function validateCommit(entry_type, entry, header, pkg, sources) {
  if (entry_type === "actionLinks") {
    return validateAddAction(entry.Links[0].Base, entry.Links[0].Link, sources[0]);
  } else if (entry_type === "gameBoard"){
    return validateGameBoard(entry);    
  } else {
    return true;
  }
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
