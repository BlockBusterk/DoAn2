import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
axios.defaults.timeout = 5000; // 5000ms = 5s


const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      timeout: 5000, // 5000ms = 5s
    });
    return data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else {
      console.error('Request failed', error);
    }
  }
};

export default fetchData;
