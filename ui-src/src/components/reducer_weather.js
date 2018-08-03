//**FYI: The mention to state here is ONLY in reference to the state that this current reducer function manages.
const defaultState = {
  weather: []
}

export default function(state=null, action) {
  switch (action.type) {
    case "FETCH_WEATHER":
    //never manipulate the state object directly (just like in React)
    //...instead just provide new/updated forms of state.
    //NB: redux-promise provides middleware functionality between the action and reducers that ensure any callbacks (ie the call for the payload) are complete
    //... and the data available before the reducers code can begin.

//this line below will effecuate the same result as the es6 syntax way on linke 18.
    //return state.concat([action.payload.data])

    //in this syntax, the first parameter ALWAYS takes the update
    //...and the second parameter is the previous state (which is with the three dots, or "ellipsis").
      return [action.payload.data, ...state];
    default:
      return state;
  }
}
