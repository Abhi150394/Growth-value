import axios from "axios";

const getScrapers = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/list/scraper/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

const startScraper = async (token, id) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/start/scraper/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token?.access}`,
          },
        }
      );
      return res;
    } catch (e) {
      console.log(e);
    }
  };

export { getScrapers, startScraper };
