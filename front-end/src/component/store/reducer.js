import { saveState, clearUserLS } from './localStorage.js'

const initialState = {}

const reducer = (state = initialState, action) => {
console.log("***action", action);
  let newState = {...state};
  if (action.type === "LOGIN") {
    newState = {...state,
      id          : action.data.user.id,
      email       : action.data.user.email,
      name        : action.data.user.name,
      token       : action.data.user.token,

      address     : action.data.user.address,
      city        : action.data.user.city,
      postalCode  : action.data.user.postalCode,
      phone       : action.data.user.phone
    };
    saveState(newState);

  } else if (action.type === "LOGOUT") {
    newState = {
      id              : undefined,
      email           : undefined,
      name            : undefined,
      token           : undefined,

      address         : undefined,
      city            : undefined,
      postalCode      : undefined,
      phone           : undefined
      // client_id       : undefined,
      // client_nickname : undefined,
      // client_dr       : undefined,

      // client_name     : undefined,
      // client_mother   : undefined,
      // client_mphone   : undefined,
      // client_memail   : undefined,
      // client_father   : undefined,
      // client_fphone   : undefined,
      // client_femail   : undefined,
      // consultant      : undefined,
      // cphone          : undefined,
      // cemail          : undefined 
    };
    clearUserLS();

  } else if (action.type === "SETCLIENT") {
console.log("error on SETCLIENT in reducer.js");
    // newState = {...state,
    //   client_id       : action.data.client._id,
    //   client_nickname : action.data.client.nickname,
    //   client_dr       : action.data.client.default_rate,

    //   client_birthday   : action.data.client.birthday,
    //   client_name       : action.data.client.name,
    //   client_mother     : action.data.client.mother,
    //   client_mphone     : action.data.client.cphone,
    //   client_memail     : action.data.client.cemail,
    //   client_father     : action.data.client.father,
    //   client_fphone     : action.data.client.fphone,
    //   client_femail     : action.data.client.femail,
    //   client_consultant : action.data.client.consultant,
    //   client_cphone     : action.data.client.cphone,
    //   client_cemail     : action.data.client.cemail
    // };
    // saveStateClient(newState)
  }
  
  return newState;
}

export default reducer;
