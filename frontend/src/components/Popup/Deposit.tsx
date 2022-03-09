import { useEffect, useState } from "react";
import iconClose from "../../images/icon-close.png";
import { InputNumber, Slider } from "antd";
import { shortBalance, shortName } from "../../utils";
import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../../state/globalStore";
import { tokenFomat } from "../../utils/token";
import { handleDeposit } from "../../services/connect";
import { Switch } from "antd";

type Props = {
  togglePopup: Function;
  tokenId?: string;
  token: any;
};
const Deposit = ({ togglePopup, token }: Props) => {
  const { contract, wallet, usdTokens, userBalance }: any =
    hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const walletState = wallet.attach(Downgraded).get();
  const usdTokensState = usdTokens.attach(Downgraded).get();
  const userBalanceState = userBalance.attach(Downgraded).get();
  const [amountToken, setAmountToken] = useState(0);
  const [amountTokenPercent, setAmountTokenPercent] = useState(0);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [shares, setShares] = useState(0);
  const [error, setError] = useState("");
  const [isCollateral, setIsCollateral] = useState(false);
  
  const tokenConfig = token && tokenFomat[token?.tokenId];
  const icon = tokenConfig && tokenConfig?.icon;
  const tokenName = tokenConfig && tokenConfig?.name;
  const tokenNameUsd = tokenConfig && tokenConfig?.nameUsd;
  const tokenDecimals = tokenConfig && tokenConfig?.decimals;
  const tokenSymbol = tokenConfig && tokenConfig?.symbol;
  const priceUsd = (usdTokensState && usdTokensState[tokenNameUsd]?.usd) ?? 1;
  const marks = {
    0: "0%",
    25: "25%",
    50: "50%",
    75: "75%",
    100: "100%",
  };

  function _onChangeCollateral(checked: boolean) {
    setIsCollateral(checked);
  }

  // should debounce
  function formatter(value: any) {
    return `${value.toString()}%`;
  }

  const _handleDeposit = () => {
    if (userTokenBalance === 0) {
      return setError(`You have 0 of tokens`);
    } else if (amountToken === 0 || amountToken === null) {
      return setError(`You have to Enter amount of Tokens`);
    } else if (amountToken > userTokenBalance) {
      return setError(`The token you have lower than value that you deposit`);
    } else if (amountToken < 0) {
      return setError(`You can not use Negative number`);
    }
    return handleDeposit(token, amountToken, contractState, isCollateral);
  };

  const onChange = (e: any) => {
    setAmountToken(e);
    setAmountTokenPercent((e / userTokenBalance) * 100);
  };

  const sliderOnChange = (e: any) => {
    setAmountToken((e / 100) * userTokenBalance);
    setAmountTokenPercent(e);
  };

  useEffect(() => {
    const getBalanceTokenUser = async () => {
      try {
        const balance = await contractState.account.viewFunction(
          token?.tokenId,
          "ft_balance_of",
          {
            account_id: walletState.getAccountId(),
          }
        );
        setUserTokenBalance(balance / 10 ** tokenDecimals);
      } catch (err) {
        console.error(err);
      }
    };
    getBalanceTokenUser();
  }, [userTokenBalance]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlEle = window.document.getElementsByTagName("html")[0];
      htmlEle.classList.add("popup-open");
    }
    return () => {
      const htmlEle = window.document.getElementsByTagName("html")[0];
      htmlEle.classList.remove("popup-open");
    };
  }, [userTokenBalance]);

  useEffect(() => {
    const rs =
      userBalanceState &&
      userBalanceState?.supplied.find(
        (item: any) => item.token_id === token.tokenId
      );
    if (!rs) return;
    // let balanceDeposit = rs.balance;
    let sharesDeposit = rs.shares;

    // balanceDeposit = (balanceDeposit / 10 ** tokenDecimals).toFixed(2);
    sharesDeposit = (sharesDeposit / 10 ** tokenDecimals).toFixed(2);

    setShares(sharesDeposit);
  }, []);

  return (
    <div className="wrap-popup">
      <div className="popup">
        <p className="icon-close" onClick={() => togglePopup()}>
          <img alt="icon-close" src={iconClose} width={12} height={12} />
        </p>
        <div className="Ocean">
          <svg className="Wave" viewBox="0 0 12960 1120">
            <path d="M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z">
              <animate
                dur="5s"
                repeatCount="indefinite"
                attributeName="d"
                values="
              M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z;
              M9720,0C8100,0,8100,319,6480,319S4860,0,3240,0,1620,320,0,320v800H12960V320C11340,320,11340,0,9720,0Z;
              M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z
            "
              />
            </path>
          </svg>
        </div>
        <h4 className="title">DEPOSIT</h4>
        <p className="icon">
          <img className="icon" src={icon} width={54} height={54} alt="Logo" />
        </p>
        <p className="icon-name">{tokenName}</p>
        <p className="value-percent">0.03%</p>
        <div className="bg-white position-relative wrap-white">
          <div className="info pad-side-14">
            <p>
              Available:{" "}
              <span className="popup-available-price">
                {shortBalance(userTokenBalance)}
              </span>
              <br />
              ($
              {shortBalance(+userTokenBalance * priceUsd)})
            </p>
            <p className="tar">
              1 {tokenSymbol} = ${shortBalance(priceUsd)}
            </p>
          </div>
          <div className="pad-side-14">
            <InputNumber
              className="input-number"
              defaultValue={0}
              type="number"
              // formatter={(value:any) =>
              //   `${shortBalance(value)}`
              // }
              value={amountToken}
              onChange={onChange}
            />
          </div>
          <div
            id="slider-range"
            className="position-relative slider-range bg-white"
          >
            <Slider
              marks={marks}
              step={1}
              tipFormatter={formatter}
              getTooltipPopupContainer={(): any =>
                document?.getElementById("slider-range")
              }
              value={amountTokenPercent || 0}
              onChange={sliderOnChange}
            />
          </div>

          <p className="position-relative total bg-white">
            Total Supply <span style={{ fontSize: 22 }}>&#8771;</span> $
            {shortBalance(amountToken * priceUsd)}
          </p>
          <p className="position-relative rates-title fwb bg-white pad-side-14">
            Supply Rates
          </p>
          <div className="position-relative flex bg-white pad-side-14">
            <div className="left">Deposit APY</div>
            <div className="right fwb">0.028533093636258104</div>
          </div>
          <div className="position-relative flex bg-white pad-side-14">
            <div className="left">Collateral Factor</div>
            <div className="right fwb">60%</div>
          </div>
          <div className="position-relative flex bg-white pad-side-14">
            <div className="left">Use as Collateral</div>
            <div className="right fwb">
              <label className="switch">
                <Switch defaultChecked={false} onChange={_onChangeCollateral} />
              </label>
            </div>
          </div>
          {error && <p className="text-error">* {error}</p>}
          <button className="position-relative btn" onClick={_handleDeposit}>
            DEPOSIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
