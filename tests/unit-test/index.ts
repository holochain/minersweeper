import { Orchestrator } from '@holochain/tryorama'

const orchestrator = new Orchestrator()

require('./game')(orchestrator)

orchestrator.run()
