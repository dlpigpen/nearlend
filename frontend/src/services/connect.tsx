import * as nearAPI from "near-api-js";
import { contractName, nearConfig } from "../utils";
import { tokenFomat } from "../utils/token";
const { connect, WalletConnection, keyStores } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();
export const GAS = 200000000000000;
export const ONE_OCTO = 1;
export const ONE_OCTO_STRING = "100000000000000000000000";

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
      "get_assets_paged",
      "get_assets_paged_detailed",
      "get_asset",
      "ft_metadata",
      "get_account",
    ],
    changeMethods: ["storage_deposit", "ft_transfer", "ft_transfer_call"],
  });
};

export const checkIsSigned = async function (wallet: any) {
  const accountId = wallet.getAccountId();
  async function initCheck() {
    var tmpAvila = await wallet.account().getAccountBalance();
    const balance = tmpAvila.available / Math.pow(10, 24);
    // console.log("accountId", accountId);
    // console.log("balance", balance);
  }
  if (wallet.isSignedIn()) {
    initCheck();
  }
};

export const isUserRegistorToken = async (
  contractState: any,
  walletState: any,
  tokenId: string
) => {
  try {
    await contractState.account
      .viewFunction(
        tokenId,
        "storage_balance_of",
        {
          account_id: walletState.getAccountId(),
        },
        GAS,
        ONE_OCTO
      )
      .then((res: any) => res);
  } catch (err) {
    console.log(err);
  }
};

export const claimFreeToken = async (
  contractState: any,
  walletState: any,
  amout: number,
  tokenId: string
) => {
  try {
    const args = {
      account_id: walletState.getAccountId(),
      amount: amout.toLocaleString("fullwide", { useGrouping: false }),
    };
    await contractState.account.functionCall(tokenId, "mint", args);
  } catch (err) {
    console.log(err);
  }
};

export const handleRegistorToken = async (
  contractState: any,
  walletState: any,
  tokenId: string
) => {
  try {
    const args = {
      account_id: walletState.getAccountId(),
      registration_only: true,
    };
    await contractState.account
      .functionCall(tokenId, "storage_deposit", args, GAS, ONE_OCTO_STRING)
      .then((res: any) => res);
  } catch (err) {
    console.log(err);
  }
};

export const handleDepositFirstTime = async function (
  contract: any,
  wallet: any
) {
  const accountId = wallet.getAccountId();
  await contract.storage_deposit(
    {
      account_id: accountId,
      registration_only: true,
    },
    GAS,
    ONE_OCTO_STRING
  );
};

export const handleDeposit = async function (
  token: any,
  amountToken: number,
  contract: any,
  isCollateral: boolean
) {
  try {
    const tokenID = token.tokenId || token.token_id;
    const tokenConfig = tokenFomat[tokenID];
    const amount = amountToken * 10 ** tokenConfig.decimals;
    let amountToString = amount.toLocaleString("fullwide", {
      useGrouping: false,
    });
    const contractID = contract.contractId;

    const msg = isCollateral
      ? `{"Execute": {"actions": [{"IncreaseCollateral": {"token_id": "${tokenID}", "amount": "${amountToString}"}}]}}`
      : "";
    const args = {
      receiver_id: contractID,
      amount: amountToString,
      msg,
    };

    return await contract.account.functionCall(
      tokenID,
      "ft_transfer_call",
      args,
      GAS,
      ONE_OCTO
    );
  } catch (error) {
    console.log(error);
  }
};

export const handleBorrow = async function (
  token: any,
  amountToken: number,
  contract: any
) {
  try {
    const tokenID = token.tokenId || token.token_id;
    const tokenConfig = tokenFomat[tokenID];
    const amount = amountToken * 10 ** tokenConfig.decimals;
    let amountToString = amount.toLocaleString("fullwide", {
      useGrouping: false,
    });
    const contractID = contract.contractId;
    const args = {
      receiver_id: contractID,
      asset_ids: ["usdt.fakes.testnet", tokenID],
      msg: `{"Execute": {"actions": [{"Borrow": {"token_id": "${tokenID}", "amount": "${amountToString}"}}]}}`,
    };

    return await contract.account.functionCall(
      "priceoracle.testnet",
      "oracle_call",
      args,
      GAS,
      ONE_OCTO
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleWithdraw = async function (
  token: any,
  amountToken: number,
  contract: any
) {
  try {
    const tokenID = token.tokenId || token.token_id;
    const tokenConfig = tokenFomat[tokenID];
    const amount = amountToken * 10 ** tokenConfig.decimals;
    let amountToString = amount.toLocaleString("fullwide", {
      useGrouping: false,
    });
    const contractID = contract.contractId;
    const args = {
      actions: [
        {
          Withdraw: {
            token_id: tokenID,
            amount: amountToString,
          },
        },
      ],
    };

    return await contract.account.functionCall(
      contractID,
      "execute",
      args,
      GAS,
      ONE_OCTO
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleDecreaseCollateral = async function (
  token: any,
  amountToken: number,
  contract: any
) {
  try {
    const tokenID = token.tokenId || token.token_id;
    const tokenConfig = tokenFomat[tokenID];
    const amount = amountToken * 10 ** tokenConfig.decimals;
    let amountToString = amount.toLocaleString("fullwide", {
      useGrouping: false,
    });
    const contractID = contract.contractId;
    const args = {
      actions: [
        {
          DecreaseCollateral: {
            token_id: tokenID,
            amount: amountToString,
          },
        },
      ],
    };

    return await contract.account.functionCall(
      contractID,
      "execute",
      args,
      GAS,
      ONE_OCTO
    );
  } catch (error) {
    console.error(error);
  }
};

export const handleIncreaseCollateral = async function (
  token: any,
  amountToken: number,
  contract: any
) {
  try {
    const tokenID = token.tokenId || token.token_id;
    const tokenConfig = tokenFomat[tokenID];
    const amount = amountToken * 10 ** tokenConfig.decimals;
    let amountToString = amount.toLocaleString("fullwide", {
      useGrouping: false,
    });
    const contractID = contract.contractId;
    const args = {
      actions: [
        {
          IncreaseCollateral: {
            token_id: tokenID,
            amount: amountToString,
          },
        },
      ],
    };

    return await contract.account.functionCall(
      contractID,
      "execute",
      args,
      GAS,
      ONE_OCTO
    );
  } catch (error) {
    console.error(error);
  }
};

/* 
 @Example Code
 @##### DO NOT DELETE
 @##### DO NOT DELETE
 @##### DO NOT DELETE
*/
// 1 - deposit to pool for first time User login
// await contract.storage_deposit(
//   {
//     account_id: accountId,
//     registration_only: true,
//   },
//   GAS,
//   "100000000000000000000000",
// );

// 2 - deposit to pool for first time User login
// await contract.account.functionCall(
//   contract.contractId,
//   "storage_deposit",
//   {
//     account_id: accountId,
//     registration_only: true,
//   },
//   GAS,
//   "100000000000000000000000"
// );
