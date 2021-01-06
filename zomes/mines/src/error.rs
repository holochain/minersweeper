use hc_utils::UtilsError;
use hdk3::prelude::*;

#[derive(thiserror::Error, Debug)]
pub enum MinesError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    HdkError(#[from] HdkError),
    #[error(transparent)]
    UtilsError(#[from] UtilsError),
    // #[error("Agent has not created a profile yet")]
    // AgentNotRegisteredProfile,
}

pub type MinesResult<T> = Result<T, MinesError>;
