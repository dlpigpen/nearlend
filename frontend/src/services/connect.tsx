import * as nearAPI from "near-api-js";
import { contractName, nearConfig } from "../utils";
const { connect, WalletConnection, keyStores } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();

export const _near = async function () {
  return await connect({
    deps: {
      keyStore,
    },
    ...nearConfig,
  });
};

export const _walletConnection = function (_near: any) {
  return new WalletConnection(_near, null);
};

export const _contract = function (wallet: any) {
  return new nearAPI.Contract(wallet.account(), contractName, {
    viewMethods: [
      "get_num",
      "get_total_pool_balance",
      "get_account",
      "get_account_supplied_balance",
      "test1",
    ],
    changeMethods: [
      "increment",
      "decrement",
      "reset",
      "supply",
      "withdraw_supply",
    ],
  });
};
export const checkIsSigned = async function (wallet: any) {
  async function sup() {
    const accountId = wallet.getAccountId();
    var tmpAvila = await wallet.account().getAccountBalance();
    const balance = tmpAvila.available / Math.pow(10, 24);
    console.log("accountId", accountId);
    console.log("balance", balance);
  }

  if (wallet.isSignedIn()) {
    sup();
  }
};
