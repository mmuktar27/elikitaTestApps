import Cookies from "js-cookie";

export const setCookies = ({ name, data }) => {
  Cookies.set(name, JSON.stringify(data));
};
