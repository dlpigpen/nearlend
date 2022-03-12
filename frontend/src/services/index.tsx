import * as nearAPI from "near-api-js";
import { tokenFomat } from "../utils/token";
const { connect, WalletConnection, keyStores } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const contractName = "priceoracle.testnet";
const nearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  contractName,
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  headers: {
    "Content-Type": "application/json",
  },
};
export const _price = async function () {
  return await connect({
    deps: {
      keyStore,
    },
    ...nearConfig,
  });
};

export const _priceConnection = function (_price: any) {
  return new WalletConnection(_price, null);
};

export const _contractPrice = function (wallet: any) {
  return new nearAPI.Contract(wallet.account(), contractName, {
    viewMethods: ["get_price_data"],
    changeMethods: [],
  });
};

export const getUsdtOfToken = async function () {
  const initPrice = await _price();
  const initPriceConnect = _priceConnection(initPrice);
  const initPriceContract: any = _contractPrice(initPriceConnect);
  var asset_ids = Object.keys(tokenFomat).map(function (key) {
    return key;
  });
  var prices = await initPriceContract.get_price_data({ asset_ids: asset_ids });
  prices = prices.prices;
  var results: any = {};
  for (var i = 0; i < prices.length; i++) {
    var element = prices[i];
    var price = element.price ? element.price.multiplier / Math.pow(10, 4) : 1;
    var token = tokenFomat[element.asset_id];
    results[token.name] = { usd: price };
  }
  return results;
};
