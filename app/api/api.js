import axios from "axios";

const API = axios.create({
  baseURL: `https://elikitawebservices-crdpgafxekayhkbe.southafricanorth-01.azurewebsites.net/api/v2/`,
  timeout: 15000,
});

/* API.interceptors.request.use((req) => {
  if (Cookies.get("elktoken")) {
    const token = Cookies.get("elktoken").replace(/"/g, "").replace(/\\/g, "");
    console.log("Outgoing Token:", token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}); */

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses
    console.error("An error occurred:", error);
    if (error?.response?.status === 401) {
      // window.location.href = `/auth/login?from=${window.location.pathname}`;
    }
    return Promise.reject(error);
  },
);

export default API;
