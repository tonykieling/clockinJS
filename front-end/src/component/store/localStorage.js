// this module allows persist the data in localStorage and keep the data among different browser tabs, and after the user rebooting the system, as well. That said, data is kept in the browser localstorage.

export const getUser = () => {
  try {
    const user = {
      id          : localStorage.getItem('id'),
      name        : localStorage.getItem('name'),
      email       : localStorage.getItem('email'),
      token       : localStorage.getItem("token"),
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
    localStorage.setItem("token", user.token);
  } catch (err) {
    return err.message;
  }
}


export const saveStateClient = client => {
  try {
    localStorage.setItem("client_id", client.client_id);
    localStorage.setItem("client_nickname", client.client_nickname);
    localStorage.setItem("client_dr", client.client_dr);

    localStorage.setItem("client_birthday", client.client_birthday);
    localStorage.setItem("client_name", client.client_name);
    localStorage.setItem("client_mother", client.client_mother);
    localStorage.setItem("client_mphone", client.client_mphone);
    localStorage.setItem("client_memail", client.client_memail);
    localStorage.setItem("client_father", client.client_father);
    localStorage.setItem("client_fphone", client.client_fphone);
    localStorage.setItem("client_femail", client.client_femail);
    localStorage.setItem("client_consultant", client.client_consultant);
    localStorage.setItem("client_cphone", client.client_cphone);
    localStorage.setItem("client_cemail", client.client_cemail)
  } catch (err) {
    return err.message;
  }
}


export const clearUserLS = () => {
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem("token");

  localStorage.removeItem("client_id");
  localStorage.removeItem("client_nickname");
  localStorage.removeItem("client_dr");

  localStorage.removeItem("client_birthday");
  localStorage.removeItem("client_name");
  localStorage.removeItem("client_mother");
  localStorage.removeItem("client_mphone");  
  localStorage.removeItem("client_memail");
  localStorage.removeItem("client_father");
  localStorage.removeItem("client_fphone");
  localStorage.removeItem("client_femail");
  localStorage.removeItem("client_consultant");
  localStorage.removeItem("client_cphone");
  localStorage.removeItem("client_cemail");
}
