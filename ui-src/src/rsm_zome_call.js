/*************************
**   RSM zome functions    **
**************************/
import { AppWebsocket } from "@holochain/conductor-api";

export let holochainClient
let isInitiatingHcConnection = false

export let CELL_ID;
export let AGENT_KEY;

const INSTALLED_APP_ID = "minersweeper"
async function initHolochainClient () {
  holochainClient = await AppWebsocket.connect(process.env.REACT_APP_DNA_INTERFACE_URL)
  await holochainClient
        .appInfo({ installed_app_id: INSTALLED_APP_ID })
        .then(appInfo => {
          // console.log("appInfo : ", appInfo);
          CELL_ID = appInfo.cell_data[0][0];
          const dnaHash = arrayBufferToBase64(CELL_ID[0]);
          // console.log("CELL_ID : ", dnaHash, arrayBufferToBase64(CELL_ID[1]));

          AGENT_KEY = CELL_ID[1];
          // console.log("agent key : ", arrayBufferToBase64(AGENT_KEY));

          });
  return holochainClient
}
async function initAndGetHolochainClient () {
  let counter = 0
  // This code is to let avoid multiple ws connections.
  // isInitiatingHcConnection is changed in a different call of this function running in parallel
  while (isInitiatingHcConnection) {
    counter++
    await wait(100)
    if (counter === 10) {
      isInitiatingHcConnection = false
    }
  }
  if (holochainClient) {return holochainClient}
  else {return initHolochainClient()}
}

export const arrayBufferToBase64 = buffer => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export function createZomeCall(zomeName, fnName, timeout) {
  return async function (args = null) {
    await initAndGetHolochainClient()
    return holochainClient.callZome(
      {
       cap: null,
       cell_id: CELL_ID,
       fn_name: fnName,
       payload: args,
       provenance: AGENT_KEY,
       zome_name: zomeName
     },
      15000
    );
  }
}
