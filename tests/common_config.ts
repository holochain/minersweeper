import { Config, InstallAgentsHapps, InstalledHapp, TransportConfigType, ProxyAcceptConfig, ProxyConfigType, NetworkType } from '@holochain/tryorama'
import path = require('path')
import * as msgpack from '@msgpack/msgpack';
import { wait } from './util'

export const NETWORK = {
  bootstrap_service: "https://bootstrap-staging.holo.host",
  network_type: NetworkType.QuicBootstrap,
  transport_pool: [{
    type: TransportConfigType.Proxy,
    sub_transport: { type: TransportConfigType.Quic },
    proxy_config: {
      type: ProxyConfigType.RemoteProxyClient,
      proxy_url: "kitsune-proxy://f3gH2VMkJ4qvZJOXx0ccL_Zo5n-s_CnBjSzAsEHHDCA/kitsune-quic/h/165.227.194.75/p/5788/--",
    }
  }],
  tuning_params: {
      gossip_loop_iteration_delay_ms: 200, //number // default 10
      default_notify_remote_agent_count: 5, //number // default 5
      default_notify_timeout_ms: 100, //number // default 1000
      default_rpc_single_timeout_ms: 20000, // number // default 2000
      default_rpc_multi_remote_agent_count: 2, //number // default 2
      default_rpc_multi_timeout_ms: 2000, //number // default 2000
      agent_info_expires_after_ms: 1000 * 60 * 20, //number // default 1000 * 60 * 20 (20 minutes)
      tls_in_mem_session_storage: 512, // default 512
      proxy_keepalive_ms: 1000 * 30, // default 1000 * 60 * 2 (2 minutes)
      proxy_to_expire_ms:  1000 * 60 * 5 // default 1000 * 60 * 5 (5 minutes)
  }
}
export const CONFIG = Config.gen({network: NETWORK})
export const LOCAL_CONFIG = Config.gen()

export const fuelDna = path.join(__dirname, "../minersweeper.dna")

export const READ_ONLY_MEM_PROOF= Buffer.from("AA==", 'base64')

export const installAgents = async (conductor, agentNames, memProofArray?) => {

  const admin = conductor.adminWs()
  console.log(`registering dna for: ${fuelDna}`)
  const  dnaHash = await conductor.registerDna({path: fuelDna}, conductor.scenarioUID, { test: !memProofArray })

  const agents: Array<InstalledHapp> = await Promise.all(agentNames.map(
    async (agent, i) => {
      console.log(`generating key for: ${agent}:`)
      const agent_key = await admin.generateAgentPubKey()
      console.log(`${agent} pubkey:`, agent_key.toString('base64'))

      let dna = {
        hash: dnaHash,
        nick: 'minersweeper',
      }
      if (memProofArray) {
        dna["membrane_proof"] = Array.from(memProofArray[i])
      }

      const req = {
        installed_app_id: `${agent}_fuel`,
        agent_key,
        dnas: [dna]
      }
      console.log(`installing happ for: ${agent}`)
      return await conductor._installHapp(req)
    }
  ))
  return agents
}

export const awaitIntegration = async(cell) => {
    while (true) {
        const dump = await cell.stateDump()
        console.log("integration dump was:", dump)
        const idump = dump[0].integration_dump
        if (idump.validation_limbo == 0 && idump.integration_limbo == 0) {
            break
        }
        console.log("waiting 5 seconds for integration")
        await wait(5000)
    }
}
