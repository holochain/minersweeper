import { Config, InstallAgentsHapps, InstalledHapp, TransportConfigType } from '@holochain/tryorama'
import path = require('path')

// const NETOWRK = {
//   transport_pool: [{
//     type: TransportConfigType.Quic,
//   }],
//   bootstrap_service: "https://bootstrap.holo.host"
// }
const NETOWRK = {
  transport_pool: [{
    type: TransportConfigType.Mem,
  }]
}

export const CONFIG = Config.gen({network: NETOWRK})

export const MINE_BUNDLE = [
  {
    path: path.join(__dirname, '../minersweeper.dna.gz'),
    nick: 'minersweeper'
  }
]
