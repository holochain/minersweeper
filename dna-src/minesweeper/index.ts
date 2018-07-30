import { GameDefinition, Size, Pos, GameBoard, MoveDefinition, GameState, Action } from '../../@types/minesweeper';

const MAX_MINE_FRACTION = 0.5 // maximum fraction of the board that may be covered in mines

/*=============================================
=            Public Zome Functions            =
=============================================*/


function newGame(payload: GameDefinition): Hash {
  debug(payload);
  let description = payload.description;
  let size = payload.size;
  let nMines = payload.nMines;

  let gameBoard = genGameBoard(description, size, nMines);
  debug(gameBoard);
  // bundleStart(1, "");
  let gameHash = commit('gameBoard', gameBoard);
  commit('gameLinks', { Links: [
    { Base: makeHash('anchor', 'currentGames'), Link: gameHash, Tag: "" } ]
  });
  // bundleClose(true);
  return gameHash;
}


function makeMove(payload: MoveDefinition): boolean {
  let gameHash = payload.gameHash;
  let action = payload.action;
  action.agentHash = App.Key.Hash;
  debug(gameHash);

  // bundleStart(1, "");
  try {
    let actionHash = commit('action', action);
    commit('actionLinks', { Links: [
      { Base: gameHash, Link: actionHash, Tag: "" } ]
    });
    return true;
  } catch (err) {
    debug(err);
    return false;
  }
}

function getCurrentGames(): [Hash, GameBoard][] {
  return getLinks(makeHash('anchor', 'currentGames'), "", {Load: true}).map(function(elem) : [Hash, GameBoard] {
    return [elem.Hash, elem.Entry];
  });
}

function getState(payload: {gameHash: Hash}): GameState {
  let gameHash = payload.gameHash;
  let actions = getLinks(gameHash, "", {Load: true}).map(function(elem) : Action {
    return elem.Entry;
  });
  return {
    actions: actions
  }
}

/*=====  End of Public Zome Functions  ======*/


/*=========================================
=            Private Functions            =
=========================================*/

let seed = 420;

function random(): number {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Returns a random integer between min (inclusive) and max (inclusive)
function randInt(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
}


function genGameBoard(description: string, size: Size, nMines: number): GameBoard {
  let mines = [];
  let x: number;
  let y: number;
  for(let i = 0; i < nMines; i++) {
    do {
      x = randInt(0, size.x);
      y = randInt(0, size.y);
    } while (mines.some(function(elem) { // ensures no duplicates
      return (x===elem.x && y===elem.y)
    }));
    mines.push({x:x, y:y});
  }

  return {
    creatorHash: App.Key.Hash,
    description: description,
    mines: mines,
    size: size,
  };
}

// player is dead if one of their reveals is a mine position
function isDead(gameBoard: GameBoard, actions: Action[]): boolean {
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
  let gameBoard = get(gameHash);
  let actions = getLinks(gameHash, "", {Load: true}).map(function(elem) {
    return elem.Entry;
  });
  let actionsFromAgent = actions.filter(function(action) {
    return action.agentHash === agentHash;
  });
  return !isDead(gameBoard, actionsFromAgent);
}

// ensures a game board is valid before it can be added
function validateGameBoard(gameBoard) {
  return gameBoard.size.x > 10 && gameBoard.size.y > 10 && gameBoard.mines.length < MAX_MINE_FRACTION*(gameBoard.size.x*gameBoard.size.y);
}

/*=====  End of Validation functions  ======*/


/*==========================================
=            Required Callbacks            =
==========================================*/

function genesis () {
  let h = commit('anchor', 'currentGames'); // ensure this always exists
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



/*=====  End of Required Callbacks  ======*/
