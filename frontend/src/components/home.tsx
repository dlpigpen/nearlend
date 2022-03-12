/* eslint-disable jsx-a11y/iframe-has-title */
import { useCallback, useEffect, useState } from "react";
import "../App.css";
import "../responsive.css";
import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../state/globalStore";
import {
  DepositPopup,
  BorrowPopup,
  RegistFirstTime,
  RequireLogin,
} from "./Popup";
import TokenList from "./token-list";
import {
  claimFreeToken,
  handleRegistorToken,
  isUserRegistorToken,
} from "../services/connect";
import { tokenFomat } from "../utils/token";

function Home() {
  const { contract, poolListToken, userBalance, isLogged, wallet }: any =
    hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const walletState = wallet.attach(Downgraded).get();
  const userBalanceState = userBalance.attach(Downgraded).get();
  const isLoggedState = isLogged.attach(Downgraded).get();
  const [isShowPopupDeposit, setIsShowPopupDeposit] = useState(false);
  const [isShowPopupBorrow, setIsShowPopupBorrow] = useState(false);
  const [isShowPopupRegist, setIsShowPopupRegist] = useState(false);
  const [isShowPopupRequireLogin, setIsShowPopupRequireLogin] = useState(false);
  const [isShowPopupRequire, setIsShowPopupPopupRequire] = useState(false);
  const [tokenList, setTokenList] = useState([]);
  const [tokenId, setTokenId] = useState("");
  const [tokenChose, setTokenChose]: any = useState(null);
  const [popupRequire, setPopupRequire] = useState({
    textTitle: "",
    textConfirm: "",
    textCancel: "",
    handleConfirm: () => {},
  });

  const setUpPopup = (e: any, item: any) => {
    e.preventDefault();
    setTokenId(item.tokenId);
    setTokenChose(item);
  };

  const openPopupDeposit = async (e: any, item: any) => {
    setUpPopup(e, item);
    handleValidate("deposit");
  };

  const openPopupBorrow = (e: any, item: any) => {
    setUpPopup(e, item);
    handleValidate("borrow");
  };

  const handleValidate = (type: string) => {
    if (!isLoggedState) {
      return setIsShowPopupRequireLogin(true);
    } else if (userBalanceState === null) {
      return setIsShowPopupRegist(true);
    } else if (isLoggedState) {
      return type === "deposit"
        ? setIsShowPopupDeposit(true)
        : setIsShowPopupBorrow(true);
    }
  };

  const _handleTogglePopupDeposit = () => {
    setIsShowPopupDeposit((prevState) => !prevState);
  };

  const _handleTogglePopupBorrow = () => {
    setIsShowPopupBorrow((prevState) => !prevState);
  };

  const _handleTogglePopupRegist = () => {
    setIsShowPopupRegist((prevState) => !prevState);
  };

  const _handleTogglePopupRequireLogin = () => {
    setPopupRequire({
      textTitle: "You need to Login to deposit or borrow !",
      textConfirm: "Log In",
      textCancel: "Cancel",
      handleConfirm: () => {},
    });
    setIsShowPopupRequireLogin((prev) => !prev);
  };

  const _handleTogglePopupRequire = async (item: any) => {
    setIsShowPopupPopupRequire((prevState) => !prevState);
    const tokenId = item?.tokenId || item?.token_id;
    if (!tokenId) return;

    const check = isUserRegistorToken(contractState, walletState, tokenId);

    if (check === null) {
      setPopupRequire({
        textTitle: "Registor this token before claim",
        textConfirm: "Registor",
        textCancel: "Cancel",
        handleConfirm: () => _handleRegistorToken(item),
      });
    } else {
      setPopupRequire({
        textTitle: "You want to claim this token ?",
        textConfirm: "Claim",
        textCancel: "Cancel",
        handleConfirm: () => _handleClaim(item),
      });
    }
  };

  const _handleRegistorToken = async (item: any) => {
    const tokenId = item?.tokenId || item?.token_id;
    if (!tokenId) return;
    await handleRegistorToken(contractState, walletState, tokenId);
  };

  const _handleClaim = async (item: any) => {
    const tokenId = item?.tokenId || item?.token_id;
    const decimals = tokenFomat[tokenId].decimals;
    if (!tokenId && !decimals) return;
    const amountClaim = 20 * 10 ** decimals;
    await claimFreeToken(contractState, walletState, amountClaim, tokenId);
  };

  const getTokenList = useCallback(async () => {
    if (contractState !== null) {
      await contractState
        .get_assets_paged({ from_index: 0, limit: 10 })
        .then((res: any) => {
          const fomat = res.map((item: any) => {
            return {
              tokenId: item[0],
              ...item[1],
            };
          });
          poolListToken.set(fomat);
          setTokenList(fomat);
          return res;
        })
        .catch((err: any) => console.log(err));
    }
  }, [contractState, poolListToken]);

  useEffect(() => {
    getTokenList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractState]);

  return (
    <div className="container homepage">
      <div className="wrap-total">
        <div className="total deposit">
          <p className="title">Total Market Deposited</p>
          <p className="value">$200,100,999</p>
        </div>
        <div className="total borrow">
          <p className="title">Total Market Borrowed</p>
          <p className="value">$50,100,999</p>
        </div>
      </div>

      <div className="wrap-market">
        <h5 className="title">Market</h5>
        <div className="wrap-label">
          <p>Asset</p>
          <p>Deposited</p>
          <p>Borrowed</p>
          <p>Deposit APY</p>
          <p>Borrow APY</p>
        </div>
        <div className="pools">
          <TokenList
            setTurnOff={setIsShowPopupPopupRequire}
            tokenList={tokenList}
            _openPopupDeposit={openPopupDeposit}
            _openPopupBorrow={openPopupBorrow}
            _handleTogglePopupRequire={_handleTogglePopupRequire}
          />
        </div>
      </div>
      {isShowPopupDeposit && (
        <DepositPopup
          tokenId={tokenId}
          token={tokenChose}
          togglePopup={_handleTogglePopupDeposit}
        />
      )}
      {isShowPopupBorrow && (
        <BorrowPopup
          tokenId={tokenId}
          token={tokenChose}
          togglePopup={_handleTogglePopupBorrow}
        />
      )}
      {isShowPopupRegist && (
        <RegistFirstTime setTurnOff={_handleTogglePopupRegist} />
      )}
      {isShowPopupRequireLogin && (
        <RequireLogin
          textTitle={
            popupRequire.textTitle || "You need to Login to deposit or borrow !"
          }
          textConfirm={popupRequire.textConfirm || "Log In"}
          textCancel={popupRequire.textCancel || "Cancel"}
          togglePopup={_handleTogglePopupRequireLogin}
        />
      )}
      {isShowPopupRequire && (
        <RequireLogin
          textTitle={popupRequire.textTitle}
          textConfirm={popupRequire.textConfirm}
          textCancel={popupRequire.textCancel}
          togglePopup={_handleTogglePopupRequire}
          handleConfirm={popupRequire.handleConfirm}
        />
      )}
    </div>
  );
}

export default Home;
