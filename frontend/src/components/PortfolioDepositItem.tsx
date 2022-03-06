import { fomatBalanceWithDecimal } from "../utils";
import { tokenFomat } from "../utils/token";
import { DownOutlined } from "@ant-design/icons";
import globalState from "../state/globalStore";
import { Downgraded, useHookstate } from "@hookstate/core";
import { useEffect, useState } from "react";
import PopupIncreaseCollateral from "./Popup/IncreaseCollateral";
import PopupDecreaseCollateral from "./Popup/DecreaseCollateral";
import PopupWithdraw from "./Popup/Withdraw";

export default function PortfolioDepositItem({ itemToken }: any) {
  const { contract, wallet, userBalance }: any = useHookstate<any>(globalState);
  const userBalanceState = userBalance.attach(Downgraded).get();
  const contractState = contract.attach(Downgraded).get();
  const walletState = wallet.attach(Downgraded).get();
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isShowIncrease, setIsShowIncrease] = useState(false);
  const [isShowDecrease, setIsShowDecrease] = useState(false);
  const [isShowWithdraw, setIsShowWithdraw] = useState(false);
  const [fund, setFund] = useState(0);
  const decimals = tokenFomat[itemToken.token_id].decimals;
  const icon = tokenFomat[itemToken.token_id].icon;
  const symbol = tokenFomat[itemToken.token_id].symbol;
  const depositedBalance = itemToken?.balance ?? 0;

  const _handleToggleDetail = (e: any) => {
    e.preventDefault();
    setIsShowDetail((prev) => !prev);
  };

  const _handleToggleIncrease = () => {
    setIsShowIncrease(!isShowIncrease);
  };

  const _handleToggleDecrease = () => {
    setIsShowDecrease(!isShowDecrease);
  };

  const _handleToggleWithdraw = () => {
    setIsShowWithdraw(!isShowWithdraw);
  };

  useEffect(() => {
    const foundFund =
      userBalanceState?.collateral?.find(
        (item: any) => item.token_id === itemToken.token_id
      )?.balance ?? 0;
    setFund(foundFund);
  }, []);

  useEffect(() => {
    const getBalanceTokenUser = async () => {
      try {
        const tokenId = itemToken?.tokenId || itemToken?.token_id;
        const balance = await contractState.account.viewFunction(
          tokenId,
          "ft_balance_of",
          {
            account_id: walletState.getAccountId(),
          }
        );
        setUserTokenBalance(balance);
      } catch (err) {
        console.log(err);
      }
    };
    getBalanceTokenUser();
  }, [userTokenBalance]);

  return (
    <div className="wrap-info active">
      {isShowIncrease && (
        <PopupIncreaseCollateral
          togglePopup={_handleToggleIncrease}
          token={itemToken}
        />
      )}
      {isShowDecrease && (
        <PopupDecreaseCollateral
          togglePopup={_handleToggleDecrease}
          token={itemToken}
        />
      )}
      {isShowWithdraw && (
        <PopupWithdraw togglePopup={_handleToggleWithdraw} token={itemToken} />
      )}
      <div className="label label__token" onClick={_handleToggleDetail}>
        <p className={`arrow-down ${isShowDetail ? "active" : ""}`}>
          <DownOutlined />
        </p>
        <div className="label__token-mini token__logo">
          <img className="icon" src={icon} width={30} height={30} alt="Logo" />
          <div className="token__price">
            <p className="token_name">{symbol}</p>
            <p className="color-space-gray">$23</p>
          </div>
        </div>
        <p className="label__token-mini">
          {(Number(itemToken.apr) * 100).toFixed(3)}%
        </p>
        <button onClick={_handleToggleWithdraw} className="button-basic">
          Withdraw
        </button>
      </div>
      {isShowDetail && (
        <div className="label label__token__detail">
          <div className="token__detail__row">
            <p className="title">Colleteral:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(fund, decimals)}
            </p>
            <button
              className="btn-plus button-basic"
              onClick={_handleToggleIncrease}
            ></button>
            <button
              className="btn-minus button-basic"
              onClick={_handleToggleDecrease}
            ></button>
          </div>
          <div className="token__detail__row">
            <p className="title">Deposited:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(depositedBalance, decimals)}
            </p>
          </div>
          <div className="token__detail__row">
            <p className="title">Available:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(userTokenBalance, decimals)}
            </p>
          </div>
          <div className="token__detail__row">
            <p className="title">Earned:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(0, decimals)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
