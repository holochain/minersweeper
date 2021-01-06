mod entries;
mod handler;
use entries::*;
use hdk3::prelude::*;
mod error;
use error::MinesResult;
use handler::*;
use hc_utils::WrappedEntryHash;

entry_defs![
    Path::entry_def(),
    ActionSchema::entry_def(),
    GameBoardSchema::entry_def()
];

pub const GAME_ROOT_PATH: &str = "minersweeper";

#[hdk_extern]
fn init(_: ()) -> MinesResult<InitCallbackResult> {
    // create the path for happs
    Path::from(GAME_ROOT_PATH).ensure()?;

    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
fn new_game(game_params: GameParams) -> MinesResult<WrappedEntryHash> {
    Ok(WrappedEntryHash(_new_game(game_params)?))
}

#[derive(Serialize, Deserialize, SerializedBytes)]
struct WrappedBool(bool);

#[hdk_extern]
fn make_move(payload: MoveDefinition) -> MinesResult<WrappedBool> {
    Ok(WrappedBool(_make_move(payload)?))
}

#[hdk_extern]
fn get_current_games(_: ()) -> MinesResult<WrapperGame> {
    _get_current_games()
}

#[hdk_extern]
fn get_state(payload: GetState) -> MinesResult<ActionVec> {
    _get_state(payload)
}

// Required Functions
/*
- [x] new_game
- [x] make_move
- [x] get_current_games
- [] get_state
- []update_identities
- [] get_identity
- [] get_identities
- [] whoami
*/
