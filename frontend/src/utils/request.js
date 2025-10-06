import axios from "axios";

const BASE_URL = "http://localhost:8080";

export default function request(api, method, data = {}) {
  const authkey = sessionStorage.getItem("authkey") || "";

  // 🧠 Automatically add authkey (only if not FormData)
  if (!(data instanceof FormData)) {
    data.authkey = authkey;
  }

  console.log("➡️ Request:", method.toUpperCase(), `${BASE_URL}${api}`, data);

  return new Promise((resolve, reject) => {
    const isFormData = data instanceof FormData;

    axios({
      url: `${BASE_URL}${api}`,
      method,
      headers: {
        // 🧩 Let axios set the right boundary header for FormData automatically
        ...(isFormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      data:
        method.toLowerCase() === "get"
          ? undefined
          : isFormData
          ? data // ✅ send raw FormData
          : JSON.stringify(data), // ✅ JSON by default
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

// Add helper methods for convenience
["get", "post", "delete"].forEach((method) => {
  request[method] = (api, data) => request(api, method, data);
});