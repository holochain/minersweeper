mod entries;
mod handler;
use entries::*;
use hdk::prelude::*;
mod error;
use handler::*;
use hc_utils::{WrappedAgentPubKey, WrappedEntryHash};

entry_defs![
    Path::entry_def(),
    ActionSchema::entry_def(),
    GameBoardSchema::entry_def()
];

pub const GAME_ROOT_PATH: &str = "minersweeper";

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    // create the path for happs
    Path::from(GAME_ROOT_PATH).ensure()?;

    Ok(InitCallbackResult::Pass)
}

#[hdk_extern]
fn new_game(game_params: GameParams) -> ExternResult<WrappedEntryHash> {
    Ok(WrappedEntryHash(_new_game(game_params)?))
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
struct WrappedBool(bool);

#[hdk_extern]
fn make_move(payload: MoveDefinition) -> ExternResult<WrappedBool> {
    Ok(WrappedBool(_make_move(payload)?))
}

#[hdk_extern]
fn get_current_games(_: ()) -> ExternResult<WrapperGame> {
    Ok(_get_current_games()?)
}

#[hdk_extern]
fn get_state(payload: GetState) -> ExternResult<ActionVec> {
    Ok(_get_state(payload)?)
}

#[hdk_extern]
fn whoami(_: ()) -> ExternResult<WrappedAgentPubKey> {
    Ok(WrappedAgentPubKey(agent_info()?.agent_initial_pubkey))
}

// Required Functions
/*
- [x] new_game
- [x] make_move
- [x] get_current_games
- [x] get_state
- []update_identities
- [] get_identity
- [] get_identities
- [] whoami
*/
