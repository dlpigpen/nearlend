import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../state/globalStore";
import { contractName } from "../utils";
import { useEffect, useState } from "react";
import logo from "../images/nearlend-text.png";
import arrow_down from "../images/arrow_down.png";
import arrow_down_white from "../images/arrow_down_white.png";
import { useLocation, Link } from "react-router-dom";
import {
  _near,
  _walletConnection,
  _contract,
  checkIsSigned,
} from "../services/connect";
import { getUsdtOfToken } from "../services";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export default function Header() {
  const { near, wallet, contract, userBalance, isLogged, usdTokens }: any =
    hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const userBalanceState = userBalance.attach(Downgraded).get();
  const walletState = wallet.attach(Downgraded).get();
  const usdTokensState = usdTokens.attach(Downgraded).get();
  const [isLoginMore, setIsLoginMore] = useState(false);
  const [listUsdPriceToken, setListUsdPriceToken] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const { pathname } = useLocation();
  const path = pathname.toString();

  const [isLogin, setIsLogin] = useState(false);
  const [accountName, setAccountName] = useState("");

  const login = () => {
    // console.log(wallet.attach(Downgraded));
    walletState.requestSignIn(contractName, "Rust Counter Example");
  };

  const logout = () => {
    // console.log("sign out: " + walletState._connectedAccount.accountId);
    walletState.signOut();
    window.location.reload();
  };

  async function initConnect() {
    try {
      const initNear = await _near();
      const initWallet = _walletConnection(initNear);
      const initContract: any = _contract(initWallet);
      const accountId =
        initWallet._authData.accountId && initWallet.getAccountId();

      contract.set(initContract);
      wallet.set(initWallet);
      near.set(initNear);

      if (accountId) {
        const isAccountDeposit = await initContract.get_account({
          account_id: accountId,
        });
        userBalance.set(isAccountDeposit);
        isLogged.set(true);
      } else {
        isLogged.set(false);
      }

      return checkIsSigned(initWallet);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickMenuItem = () => {
    setIsLoginMore(false)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (contractState === null || userBalanceState === null) {
      initConnect();
    }
    if (typeof window !== "undefined") {
      window.document
        .getElementsByTagName("html")[0]
        .classList.remove("nav-open");
      window.addEventListener("scroll", handleScoll);

      if (window.innerWidth > 820) {
        setIsMobile(false)
      }
      return () => window.removeEventListener("scroll", handleScoll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      try {
        if (!contractState || !walletState) return;
        const user = await contractState.get_account({
          account_id: walletState.getAccountId(),
        });
        userBalance.set(user);
      } catch (error) {
        console.log(error);
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (contractState?.account.accountId) {
      setIsLogin(true);
      setAccountName(contractState?.account.accountId);
    }
  }, [contractState]);

  const handleScoll = () => {
    const elementTopMenu: Element | null =
      window.document.getElementById("wrap-header-menu");
    if (window.scrollY >= 100) {
      elementTopMenu && elementTopMenu.classList.add("active");
    } else {
      elementTopMenu && elementTopMenu.classList.remove("active");
    }
  };

  useEffect(() => {
    async function initGetUSDPrice() {
      const res = await getUsdtOfToken();
      setListUsdPriceToken(res);
      usdTokens.set(res);
    }
    initGetUSDPrice();
  }, []);

  return (
    <header id="wrap-header-menu" className="header">
      <div className="container">
        <h1>
          <Link to="/">
            <img alt="Nearlend" src={logo} width={98} height={98} />
          </Link>
        </h1>
        {isMobile && <div className="hamburger" onClick={handleOpenMenu}>
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>}
        {/* {!isMobile && ( */}
          <nav className={isMenuOpen ? 'active' : ''}>
            {console.log('aaaaaa')}
            <ul>
              <li onClick={handleClickMenuItem}>
                <Link to="/">Home</Link>
              </li>
              <li onClick={handleClickMenuItem}>
                <Link to="/white-paper">Whitepaper</Link>
              </li>
              {path === "/" ? (
                <>
                  <li onClick={handleClickMenuItem}>
                    <Link to="/app">Launch App</Link>
                  </li>
                  <li onClick={handleClickMenuItem}>
                    <Link to="/marketplace">Marketplace</Link>
                  </li>
                </>
              ) : (
                ""
              )}
              {path === "/app" ||
              path === "/portfolio" ||
              path === "/marketplace" ? (
                isLogin ? (
                  <>
                    {/* {path === "/portfolio" || path === "/marketplace"  ? (
                    <> */}
                    <li onClick={handleClickMenuItem}>
                      <Link to="/app">App</Link>
                    </li>
                    <li onClick={handleClickMenuItem}>
                      <Link to="/marketplace">Marketplace</Link>
                    </li>
                    {/* </>
                  ) : (
                    ""
                  )} */}
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
                        onClick={handleClickMenuItem}
                      >
                        <Link to="/portfolio">
                          <span
                            className={`${
                              path === "/portfolio" ? "link-active" : "ok"
                            }`}
                          >
                            Portfolio
                          </span>
                        </Link>
                        <a href={"?"} onClick={logout}>
                          Sign Out
                        </a>
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
        {/* )} */}
      </div>
    </header>
  );
}
