import { saveState, clearUserLS, saveStateClient } from './localStorage.js'

const initialState = {}

const reducer = (state = initialState, action) => {
// console.log("action", action);
  let newState = {...state};
  if (action.type === "LOGIN") {
    newState = {...state,
      id          : action.data.user.id,
      email       : action.data.user.email,
      name        : action.data.user.name,
      token       : action.data.user.token
    };
    saveState(newState);

  } else if (action.type === "LOGOUT") {
    newState = {
      id              : undefined,
      email           : undefined,
      name            : undefined,
      token           : undefined,
      client_id       : undefined,
      client_nickname : undefined,
      client_dr       : undefined
    };
    clearUserLS();

  } else if (action.type === "SETCLIENT") {
    newState = {...state,
      client_id       : action.data.client._id,
      client_nickname : action.data.client.nickname,
      client_dr       : action.data.client.default_rate
    };
    saveStateClient(newState)
  }
  
  return newState;
}

export default reducer;
