extern crate serde;
use crate::entries::*;
use crate::error::MinesResult;
use crate::GAME_ROOT_PATH;
use hc_utils::{get_links_and_load_type, WrappedAgentPubKey, WrappedEntryHash};
use hdk::prelude::*;

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct GameParams {
    n_mines: i64,
    size: Properties,
    description: Option<String>,
}

pub fn _new_game(game_params: GameParams) -> MinesResult<EntryHash> {
    // Create game board
    let game_board = gen_game_board(game_params)?;
    // commit game_board_schema
    create_entry(&game_board)?;
    let hash = hash_entry(&game_board)?;
    // link it to an anchor
    let game_path = Path::from(GAME_ROOT_PATH);
    let games_root_path_address = game_path.hash()?;

    create_link(
        games_root_path_address.into(),
        hash.clone().into(),
        GameBoardTag::tag(),
    )?;
    Ok(hash)
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct WrapperGame(Vec<(WrappedEntryHash, GameBoardSchema)>);

pub fn _get_current_games() -> MinesResult<WrapperGame> {
    let game_path = Path::from(GAME_ROOT_PATH);
    let games_root_path_address = game_path.hash()?;

    let games: Vec<GameBoardSchema> =
        get_links_and_load_type(games_root_path_address.into(), Some(GameBoardTag::tag()))?;
    let mut list: Vec<(WrappedEntryHash, GameBoardSchema)> = Vec::new();
    for game in games {
        list.push((WrappedEntryHash(hash_entry(&game.clone())?), game.clone()))
    }
    Ok(WrapperGame(list))
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct GetState {
    game_hash: WrappedEntryHash,
}
#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct ActionVec(Vec<ActionSchema>);
pub fn _get_state(payload: GetState) -> MinesResult<ActionVec> {
    let actions: Vec<ActionSchema> =
        get_links_and_load_type(payload.game_hash.0.into(), Some(ActionTag::tag()))?;
    Ok(ActionVec(actions))
}

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct MoveDefinition {
    game_hash: WrappedEntryHash,
    action: Action,
}
#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
pub struct Action {
    pub action_type: String,
    pub position: Option<Properties>,
    pub text: Option<String>,
}

pub fn _make_move(payload: MoveDefinition) -> MinesResult<bool> {
    let game_hash = payload.game_hash.0;
    let action_stamp = get_links(game_hash.clone().into(), Some(ActionTag::tag()))?
        .into_inner()
        .len();
    // let mut action_type = ActionType::REVEAL;
    // if payload.action.action_type == "chat" {
    //     action_type = ActionType::CHAT
    // }
    // if payload.action.action_type == "flag" {
    //     action_type = ActionType::FLAG
    // }
    let action = ActionSchema {
        agent_hash: WrappedAgentPubKey(agent_info()?.agent_initial_pubkey),
        timestamp: action_stamp as i64,
        action_type: payload.action.action_type,
        position: payload.action.position,
        text: payload.action.text,
    };
    let hash = hash_entry(&action)?;

    match create_entry(&action) {
        Ok(a) => a,
        Err(_) => return Ok(false),
    };

    match create_link(game_hash.into(), hash.clone().into(), ActionTag::tag()) {
        Ok(_) => return Ok(true),
        Err(_) => return Ok(false),
    };
}

fn gen_game_board(game_params: GameParams) -> MinesResult<GameBoardSchema> {
    let mut mines: Vec<Properties> = Vec::new();
    let description = game_params.description;
    let n_mines = game_params.n_mines;
    let size = game_params.size;
    let n_squares = size.x * size.y;
    let seed = 420;
    for i in 0..n_squares {
        let remaining_mines = n_mines - mines.len() as i64;
        let remaining_squares = n_squares - i;
        if remaining_mines / remaining_squares >= random((seed.clone() + i.clone()) as f64) {
            let x = i % size.x;
            let y = ((i / size.x) as f64).floor();
            mines.push(Properties { x, y: y as i64 });
        }
    }

    return Ok(GameBoardSchema {
        creator_hash: WrappedAgentPubKey(agent_info()?.agent_initial_pubkey),
        description,
        mines,
        size,
    });
}
fn random(seed: f64) -> i64 {
    let x = seed.sin() * 10000 as f64;
    return (x - x.floor()) as i64;
}
