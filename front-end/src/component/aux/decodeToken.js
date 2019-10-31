import jwtDecode from "jwt-decode";

const decodeToken = (rawToken) => {
  if (!rawToken)
    return null;
  const decodedToken = jwtDecode(rawToken);

  return (decodedToken.email ? decodedToken.email : null);
}

export default decodeToken;