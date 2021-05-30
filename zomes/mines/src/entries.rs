use hc_utils::*;
use hdk::prelude::*;

#[hdk_entry(id = "action_schema", visibility = "public", required_validations = 2)]
pub struct ActionSchema {
    pub agent_hash: WrappedAgentPubKey,
    pub action_type: String,
    pub timestamp: i64,
    pub position: Option<Properties>,
    pub text: Option<String>,
}
// #[derive(Serialize, Deserialize, SerializedBytes, Debug)]
// pub enum ActionType {
//     REVEAL,
//     FLAG,
//     CHAT,
// }

// IDK why I named this Properties. :)
#[derive(Serialize, Deserialize, SerializedBytes, Debug, Clone)]
pub struct Properties {
    pub x: i64,
    pub y: i64,
}

#[hdk_entry(
    id = "game_board_schema",
    visibility = "public",
    required_validations = 2
)]
#[derive(Clone)]
pub struct GameBoardSchema {
    pub creator_hash: WrappedAgentPubKey,
    pub description: Option<String>,
    pub mines: Vec<Properties>,
    pub size: Properties,
}

pub(crate) struct GameBoardTag;

impl GameBoardTag {
    const TAG: &'static [u8; 6] = b"boards";
    /// Create the tag
    pub(crate) fn tag() -> LinkTag {
        LinkTag::new(*Self::TAG)
    }
}

pub(crate) struct ActionTag;

impl ActionTag {
    const TAG: &'static [u8; 6] = b"action";
    /// Create the tag
    pub(crate) fn tag() -> LinkTag {
        LinkTag::new(*Self::TAG)
    }
}
