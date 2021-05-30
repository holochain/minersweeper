use hc_utils::UtilsError;
use hdk::prelude::*;

#[derive(thiserror::Error, Debug)]
pub enum MinesError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    UtilsError(#[from] UtilsError),
    // #[error("Agent has not created a profile yet")]
    // AgentNotRegisteredProfile,
}

pub type MinesResult<T> = Result<T, MinesError>;
impl From<MinesError> for WasmError {
    fn from(c: MinesError) -> Self {
        WasmError::Guest(c.to_string())
    }
}
