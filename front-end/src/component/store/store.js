import { createStore } from 'redux';
import reducer from './reducer.js';
import { getUser } from './localStorage.js';
// import { checkServerIdentity } from 'tls';

const persistedData = {
  id          : getUser().id,
  email       : getUser().email,
  name        : getUser().name,
  token       : getUser().token,

  address     : getUser().address,
  city        : getUser().city,
  postalCode  : getUser().postalCode,
  phone       : getUser().phone,
  mailGun     : getUser().mailGun
}

const store = createStore(
  reducer,
  persistedData );

store.subscribe(() => {
  // console.log("store.subscribe- ", store.getState());
})

export default store
