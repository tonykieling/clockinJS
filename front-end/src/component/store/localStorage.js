// this module allows persist the data in localStorage and keep the data among different browser tabs, and after the user rebooting the system, as well. That said, data is kept in the browser localstorage.

export const getUser = () => {
  try {
    const user = {
      id          : localStorage.getItem('id'),
      name        : localStorage.getItem('name'),
      email       : localStorage.getItem('email'),
      token       : localStorage.getItem("token")
    }
    return(user ? user : undefined);

  } catch (err) {
    return undefined;
  }
}

export const saveState = user => {
  try {
    localStorage.setItem('id', user.id);
    localStorage.setItem('email', user.email);
    localStorage.setItem('name', user.name);
    localStorage.setItem('token', user.token);

  } catch (err) {
    return err.message;
  }
}

export const clearUserLS = () => {
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
}
