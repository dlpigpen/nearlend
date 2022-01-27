import { Link } from "react-router-dom";
import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../state/globalStore";
import { contractName } from "../utils";
import { useEffect, useState } from "react";
import logo from "../images/nearlend-text.png";
import arrow_down from "../images/arrow_down.png";
import arrow_down_white from "../images/arrow_down_white.png";
import { useLocation } from "react-router-dom";
import {
  _near,
  _walletConnection,
  _contract,
  checkIsSigned,
} from "../services/connect";

export default function Header() {
  const { near, wallet, contract, userBalance }: any =
    hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const userBalanceState = userBalance.attach(Downgraded).get();
  const [isLoginMore, setIsLoginMore] = useState(false);
  const { pathname } = useLocation();
  const path = pathname.toString();

  const [isLogin, setIsLogin] = useState(false);
  const [accountName, setAccountName] = useState("");

  const login = () => {
    wallet
      .attach(Downgraded)
      .get()
      .requestSignIn(contractName, "Rust Counter Example");
  };

  const logout = () => {
    console.log("sign out: " + wallet.attach(Downgraded).get()._connectedAccount.accountId);
    wallet
      .attach(Downgraded)
      .get()
      .signOut();
    window.location.reload();
  };

  async function initConnect() {
    const initNear = await _near();
    const initWallet = _walletConnection(initNear);
    const initContract: any = _contract(initWallet);

    near.set(initNear);
    wallet.set(initWallet);
    contract.set(initContract);

    return checkIsSigned(initWallet, initContract);
  }

  useEffect(() => {
    if (!contractState && !userBalanceState) {
      initConnect();
    }
    if (typeof window !== "undefined") {
      window.document
        .getElementsByTagName("html")[0]
        .classList.remove("nav-open");
      window.addEventListener("scroll", handleScoll);
      return () => window.removeEventListener("scroll", handleScoll);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      const user = await contract
        .attach(Downgraded)
        .get()
        .get_account({
          account_id: wallet.attach(Downgraded).get().getAccountId(),
        });
      userBalance.set(user);
    }, 100);
  }, []);

  useEffect(() => {
    if (contract.attach(Downgraded).get()?.account.accountId) {
      setIsLogin(true);
      setAccountName(contract.attach(Downgraded).get()?.account.accountId);
    }
  }, [contract]);

  const handleScoll = () => {
    const elementTopMenu: Element | null =
      window.document.getElementById("wrap-header-menu");
    if (window.scrollY >= 100) {
      elementTopMenu && elementTopMenu.classList.add("active");
    } else {
      elementTopMenu && elementTopMenu.classList.remove("active");
    }
  };

  return (
    <header id="wrap-header-menu" className="header">
      <div className="container">
        <h1>
          <Link to="/">
            <img alt="Nearlend" src={logo} width={98} height={98} />
          </Link>
        </h1>
        <nav>
          <ul>
            <li onClick={() => setIsLoginMore(false)}>
              <Link to="/">Home</Link>
            </li>
            <li onClick={() => setIsLoginMore(false)}>
              <Link to="/">Docs</Link>
            </li>
            {path === "/" ? (
              <li onClick={() => setIsLoginMore(false)}>
                <Link to="/app">Launch App</Link>
              </li>
            ) : (
              ""
            )}
            {path === "/app" || path === "/portfolio" ? (
              isLogin ? (
                <>
                  {path === "/portfolio" ? (
                    <li onClick={() => setIsLoginMore(false)}>
                      <Link to="/app">App</Link>
                    </li>
                  ) : (
                    ""
                  )}
                  <li
                    className="btn-connect"
                    onClick={() => setIsLoginMore(!isLoginMore)}
                  >
                    {accountName}{" "}
                    <img
                      alt="Arrow down"
                      src={arrow_down_white}
                      width={12}
                      height={10}
                    />
                    <div
                      className={`more ${isLoginMore ? "active" : ""}`}
                      onClick={() => setIsLoginMore(false)}
                    >
                      <Link to="/portfolio">
                        <a
                          className={`${
                            path === "/portfolio" ? "link-active" : "ok"
                          }`}
                        >
                          Portfolio
                        </a>
                      </Link>

                      <a onClick={logout}>Sign Out</a>
                    </div>
                  </li>
                </>
              ) : (
                <li onClick={login} className="btn-connect">
                  Connect to Wallet
                </li>
              )
            ) : (
              ""
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
