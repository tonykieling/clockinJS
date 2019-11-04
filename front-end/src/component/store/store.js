import { createStore } from 'redux';
import reducer from './reducer.js';
import { getUser } from './localStorage.js';

const persistedData = {
  id          : getUser().id,
  email       : getUser().email,
  name        : getUser().name,
  token       : getUser().token
}

const store = createStore(
  reducer,
  persistedData );

store.subscribe(() => {
  console.log("store.subscribe- ", store.getState())
})

export default store
