import { useEffect, useState } from "react";
import iconShib from "../../images/icon-shib.png";
import iconClose from "../../images/icon-close.png";
import { InputNumber, Slider } from "antd";
import { shortBalance, totalBalanceMaxBorrow } from "../../utils";
import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../../state/globalStore";
import { tokenFomat } from "../../utils/token";
import { handleBorrow } from "../../services/connect";
import { getUsdtOfToken } from "../../services";

type Props = {
  togglePopup: Function;
  tokenId?: string;
  token: any;
};
const Borrow = ({ togglePopup, token }: Props) => {
  const { contract, wallet, usdTokens, userBalance, poolListToken }: any =
    hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const poolListTokenState = poolListToken.attach(Downgraded).get();
  const usdTokensState = usdTokens.attach(Downgraded).get();
  const userBalanceState = userBalance.attach(Downgraded).get();
  const [amountToken, setAmountToken] = useState(0);
  const [amountTokenPercent, setAmountTokenPercent] = useState(0);
  const [collateral, setCollatertal] = useState(0);
  const [available, setAvailable] = useState<any>(0);
  const [tokenUsd, setTokenUsd] = useState(0);
  const [totalUsd, setTotalUsd] = useState<any>(0);
  const [error, setError] = useState("");
  const tokenId = token.tokenId || token.token_id;
  const tokenConfig = tokenFomat[tokenId];
  const icon = tokenConfig?.icon;
  const tokenName = tokenConfig?.name;
  const tokenNameUsd = tokenConfig?.nameUsd;
  const tokenDecimals = tokenConfig?.decimals;
  const tokenSymbol = tokenConfig && tokenConfig?.symbol;
  const priceUsd = (usdTokensState && usdTokensState[tokenNameUsd]?.usd) ?? 23;
  const marks = {
    0: "0%",
    25: "25%",
    50: "50%",
    75: "75%",
    100: "100%",
  };
  function formatter(value: any) {
    // console.log(value)
    return `${value.toString()}%`;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlEle = window.document.getElementsByTagName("html")[0];
      const popupEle = window.document.getElementsByTagName("wrap-popup")[0];
      if (popupEle) {
        popupEle.addEventListener("click", () => {
          togglePopup();
        });
      }
      htmlEle.classList.add("popup-open");
    }
    return () => {
      const htmlEle = window.document.getElementsByTagName("html")[0];
      htmlEle.classList.remove("popup-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const collateral__To__USDT = totalBalanceMaxBorrow(
      userBalanceState?.collateral,
      usdTokensState,
      poolListTokenState
    );
    const { usd } = usdTokensState[tokenConfig.nameUsd] ?? { usd: 0 };
    setTokenUsd(usd);
    setTotalUsd(collateral__To__USDT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collateral, userBalanceState, usdTokens]);

  useEffect(() => {
    if (totalUsd && tokenUsd) {
      const available = totalUsd / tokenUsd;
      setAvailable(available.toFixed(3));
    }
  }, [tokenUsd, totalUsd, available]);

  useEffect(() => {
    async function initGetUSDPrice() {
      const res = await getUsdtOfToken();
      if (res !== null) {
        usdTokens.set(res);
      }
    }
    const init = async () => await initGetUSDPrice();
    const interval = setInterval(init, 10000);

    //clean component
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const foundCollateral =
      userBalanceState?.collateral?.find(
        (item: any) => item.token_id === tokenId
      )?.balance ?? 0;
    setCollatertal(foundCollateral);
  }, []);

  const _handleBorrow = () => {
    if (available === 0) {
      return setError(`You need to deposit before borrow`);
    } else if (amountToken === 0 || amountToken === null) {
      return setError(`You have to Enter amount of Tokens`);
    } else if (amountToken > available) {
      return setError(`You out of Limits Available`);
    } else if (amountToken < 0) {
      return setError(`You can not borrow with Negative number`);
    } else if (amountToken < 0) {
      return setError(`You can not use Negative number`);
    }
    return handleBorrow(token, amountToken, contractState);
  };

  const onChange = (e: any) => {
    setAmountToken(e);
    setAmountTokenPercent((e / available) * 100);
  };

  const sliderOnChange = (e: any) => {
    setAmountToken((e / 100) * available);
    setAmountTokenPercent(e);
  };

  return (
    <div className="wrap-popup">
      <div className="popup">
        <p className="icon-close" onClick={() => togglePopup()}>
          <img alt="icon-close" src={iconClose} width={12} height={12} />
        </p>
        <div className="Ocean">
          <svg className="Wave" viewBox="0 0 12960 1120">
            <path
              className="WavePath"
              d="M9720,320C8100,320,8100,0,6480,0S4860,320,3240,320,1620,0,0,0V1120H12960V0C11340,0,11340,320,9720,320Z"
            >
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
        <h4 className="title">Borrow</h4>
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
                {shortBalance(available)}
              </span>
              <br />
              ($
              {shortBalance(totalUsd)})
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
              // formatter={(value) => {
              //   // const val = value?.toString();
              //   return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              // }}
              keyboard={true}
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
            Total Borrow <span style={{ fontSize: 22 }}>&#8771;</span> $
            {shortBalance(amountToken * priceUsd)}
          </p>
          <p className="position-relative rates-title fwb bg-white pad-side-14">
            Borrow Rates
          </p>
          <div className="position-relative flex bg-white pad-side-14">
            <div className="left">Borrow APY</div>
            <div className="right fwb">0.028533093636258104</div>
          </div>
          <div className="position-relative flex bg-white pad-side-14">
            <div className="left">Collateral Factor</div>
            <div className="right fwb">60%</div>
          </div>
          {error && <p className="text-error">* {error}</p>}
          <button className="position-relative btn" onClick={_handleBorrow}>
            BORROW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
