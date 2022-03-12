import { fomatBalanceWithDecimal } from "../utils";
import { tokenFomat } from "../utils/token";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Downgraded, useHookstate } from "@hookstate/core";
import globalState from "../state/globalStore";

export default function PortfolioBorrowItem({ borrowed, supplied }: any) {
  const { userBalance }: any =
    useHookstate<any>(globalState);
  const userBalanceState = userBalance.attach(Downgraded).get();
  const [isShowDetail, setIsShowDetail] = useState(false);
  const decimals = tokenFomat[borrowed.token_id].decimals;
  const icon = tokenFomat[borrowed.token_id].icon;
  const symbol = tokenFomat[borrowed.token_id].symbol;
  const borrowedBalance = borrowed?.balance ?? 0;
  const collateral =
    userBalanceState?.collateral?.find(
      (item: any) => item.token_id === borrowed.token_id
    )?.balance ?? 0;

  const _handleToggle = (e: any) => {
    e.preventDefault();
    setIsShowDetail((prev) => !prev);
  };

  return (
    <div className="wrap-info active">
      <div className="label label__token" onClick={_handleToggle}>
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
          {(Number(borrowed.apr) * 100).toFixed(3)}%
        </p>
        <button className="button-basic">Borrow</button>
      </div>
      {isShowDetail && (
        <div className="label label__token__detail">
          <div className="token__detail__row">
            <p className="title">Available:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(collateral, decimals)}
            </p>
          </div>
          <div className="token__detail__row">
            <p className="title">Borrowed:</p>
            <p className="label__token-mini">
              {fomatBalanceWithDecimal(borrowedBalance, decimals)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
