import axios from "axios";

export const getUsdtOfToken = async () => {
  const result = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ref-finance%2Cnear%2Cneo%2Cusdt%2Caurora%2Cethereum%2Cxdai&vs_currencies=usd"
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return null
    });

  return result;
};
