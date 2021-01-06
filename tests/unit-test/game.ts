import { InstalledHapp } from '@holochain/tryorama'
import path = require('path')
import { InstallAppRequest } from '@holochain/conductor-api'
import * as _ from 'lodash'
import { wait } from '../util'
const delay = ms => new Promise(r => setTimeout(r, ms))
import { CONFIG, MINE_BUNDLE } from '../common_config'

module.exports = (orchestrator) => {

  orchestrator.registerScenario('test mines zomes', async (s, t) => {
    // spawn the conductor process
    const [ conductor ] = await s.players([CONFIG])
    const admin = conductor.adminWs();
    const agentNames = ['alice', 'bobbo']
    const agents: Array<InstalledHapp> = await Promise.all(agentNames.map(
      async agent => {
        const req: InstallAppRequest = {
          installed_app_id: `${agent}_mines`,
          agent_key: await admin.generateAgentPubKey(),
          dnas: MINE_BUNDLE
        }
        return await conductor._installHapp(req)
      }
    ))
    const [alice_happ , bobbo_happ] = agents
    const alice = alice_happ.cells[0]
    const bobbo = bobbo_happ.cells[0]

    // Create a channel
    const game_input = {
      "description": "This is my awesome new game",
      "size" : {
          "x" : 30,
          "y" : 30
      },
      "n_mines" : 4
    };
    let game_hash;

    game_hash = await alice.call('mines', 'new_game', game_input);
    console.log("Game_Hash:", game_hash);
    t.ok(game_hash)
    await wait(5000)

    let list_games = await alice.call('mines', 'get_current_games', null);
    console.log("Game_list:", list_games);
    t.ok(list_games)

    let made_move = {
      game_hash,
      action : {
        "action_type" : "reveal",
        "position" : {"x" : 20, "y" : 14}
      }
    };
    let move = await alice.call('mines', 'make_move', made_move);
    console.log("Move:", move);
    t.ok(move)

    let list_move = await alice.call('mines', 'get_state', {game_hash});
    console.log("Game_list:", list_move);
    t.ok(list_move)


  })
}
