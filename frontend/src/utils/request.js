import axios from "axios";

const BASE_URL = "http://localhost:8080";

export default function request(api, method, data = {}) {
  // console.log(sessionStorage);

  const authkey = sessionStorage.getItem("authkey") || "";
    data.authkey = authkey;

  console.log("➡️ Request:", method.toUpperCase(), `${BASE_URL}${api}`, data);

  return new Promise((resolve, reject) => {
    axios({
      url: `${BASE_URL}${api}`,
      method,
      headers: {
        "Content-Type": "application/json",
      },
      data: method.toLowerCase() === "get" ? undefined : data,
      params: method.toLowerCase() === "get" ? data : undefined,
    })
      .then((res) => {
        console.log("✅ Response:", res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.error("❌ API Error:", err.response?.data || err.message);
        reject(err.response?.data || err.message);
      });
  });
}

// Add shortcut helpers for convenience
["get", "post", "delete"].forEach((method) => {
  request[method] = (api, data) => request(api, method, data);
});
