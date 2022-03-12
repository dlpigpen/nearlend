import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../state/globalStore";
import { useEffect, useState } from "react";
import { shortBalance, totalBalance } from "../utils";
import PortfolioDeposit from "./PortfolioDeposit";
import PortfolioBorrow from "./PortfolioBorrow";

export default function Portfolio() {
  const { userBalance, usdTokens }: any = hookState<any>(globalState);
  const userBalanceState = userBalance.attach(Downgraded).get();
  const usdTokensState = usdTokens.attach(Downgraded).get();
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setAccount(userBalanceState);
    }, 500);
  }, [userBalanceState]);

  return (
    <main className="container portforlio homepage">
      <div className="total">
        <div className="wrap-total">
          <div className="total deposit">
            <p className="title">My Total Deposits</p>
            <p className="value">
              ${shortBalance(totalBalance(account?.supplied, usdTokensState))}
            </p>
          </div>
          <div className="total deposit">
            <p className="title">Net APY</p>
            <p className="value">....</p>
          </div>
          <div className="total borrow">
            <p className="title">My Total Borrows</p>
            <p className="value">
              ${shortBalance(totalBalance(account?.borrowed, usdTokensState))}
            </p>
          </div>
        </div>
      </div>

      <div className="token-list">
        <div className="side">
          <div className="my-info">
            <h5>Deposited</h5>
            <h5>
              ${shortBalance(totalBalance(account?.supplied, usdTokensState))}
            </h5>
          </div>
          <div className="detail">
            <div className="label">
              <p className="title">Asset</p>
              <p className="title">APY</p>
              <p className="title">Actions</p>
            </div>
            <PortfolioDeposit
              supplied={account?.supplied}
              borrowed={account?.borrowed}
              collateral={account?.collateral}
            />
          </div>
        </div>
        <div className="side">
          <div className="my-info">
            <h5>Borrowed</h5>
            <h5>
              ${shortBalance(totalBalance(account?.borrowed, usdTokensState))}
            </h5>
          </div>
          <div className="detail">
            <div className="label">
              <p className="title">Asset</p>
              <p className="title">APY</p>
              <p className="title">Actions</p>
            </div>
            <PortfolioBorrow
              borrowed={account?.borrowed}
              supplied={account?.supplied}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
