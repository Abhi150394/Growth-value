import axios from "axios";

const getDummyData = async (token) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/shipday/orders/`,
            {
                headers: {
                    Authorization: `Bearer ${token?.access}`,
                },
            }
        );
        return res;

    } catch (err) {
        console.log(err)
    }
}

export default getDummyData;