/* tslint:disable */

import { Hash } from "../../holochain"
import {Action, GameBoard, GameParams, MoveDefinition, Size} from "../../minesweeper"

export = 0;
let module = {}

const MAX_MINE_FRACTION = 0.5 // maximum fraction of the board that may be covered in mines

/*=============================================
=            Public Zome Functions            =
=============================================*/


function newGame(payload: GameParams): Hash {
  //debug(payload);
  let description = payload.description;
  let size = payload.size;
  let nMines = payload.nMines;

  let gameBoard = genGameBoard(description, size, nMines);
  debug("GameBoard: "+gameBoard);
  // bundleStart(1, "");
  let gameHash = commit('gameBoard', gameBoard);
  debug(gameHash)
  commit('gameLinks', { Links: [
    { Base: makeHash('anchor', 'currentGames'), Link: gameHash, Tag: "" } ]
  });
  // bundleClose(true);
  debug("GameBoard Created Successfully")
  return gameHash;
}


function makeMove(payload: MoveDefinition): boolean {
  const gameHash = payload.gameHash;
  const action: Action = {
    agentHash: App.Key.Hash,
    ...payload.action
  };

  // bundleStart(1, "");
  try {
    const actionHash = commit('action', action);
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

function getState(payload: {gameHash: Hash}): Action[] {
  let gameHash = payload.gameHash;
  debug("getting state from:" + gameHash);
  let actions = getLinks(gameHash, "", {Load: true}).map(function(elem) : Action {
    return elem.Entry;
  });
  return actions;
}

function updateIdentity(payload: {newID: string}): boolean {
  try {
    debug("updating identity to: "+ payload.newID);
    updateAgent({Identity: payload.newID, Revocation: "x"});
    let result = update("agentID", App.Agent.String, App.Key.Hash);
    let updatedID = get(App.Key.Hash);
    return true;
  } catch (err) {
    return false
  }
}

function getIdentity(payload: {agentHash: Hash}): Hash | undefined {
  try {
    let h = get(payload.agentHash);
    return h;
  } catch (err) {
    return undefined;
  }
}

// function for batch getting a bunch of identities
function getIdentities(payload: {agentHashes: Hash[]}): [Hash, string][] {
  const result: [Hash, string][] = [];
  payload.agentHashes.forEach(hash => {
    const identity = getIdentity({agentHash: hash});
    if (identity !== undefined) {
      result.push([hash, identity]);
    }
  });
  return result;
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
      x = randInt(0, size.x-1);
      y = randInt(0, size.y-1);
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
// only allow actions to be taken on locations that have not aready been acted on
function validateAddAction(gameHash, actionHash, agentHash) {
  let action: Action = get(actionHash);
  if(action.actionType === "chat") return true;

  let gameBoard: GameBoard = get(gameHash);
  let actions = getLinks(gameHash, "", {Load: true}).map(function(elem) {
    return elem.Entry;
  });
  return !actions.some((existingAction: Action) => {
    if(existingAction.actionType === "chat" || action.actionType === "chat") return false;
    return action.position.x === existingAction.position.x && action.position.y === existingAction.position.y;
  });
}

// ensures a game board is valid before it can be added
function validateGameBoard(gameBoard) {
  return true;//gameBoard.size.x > 10 && gameBoard.size.y > 10 && gameBoard.mines.length < MAX_MINE_FRACTION*(gameBoard.size.x*gameBoard.size.y);
}

/*=====  End of Validation functions  ======*/


/*==========================================
=            Required Callbacks            =
==========================================*/

function genesis () {
  let h = commit('anchor', 'currentGames'); // ensure this always exists
  debug("Joining with identity: "+App.Agent.String);
  update("agentID", App.Agent.String, App.Key.Hash);
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
