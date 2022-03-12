import { Outlet, useLocation } from "react-router-dom";
import Home from "../routes/home";
import Intro from "../routes/intro";
import waveTop from "../images/wave-top.png";
import waveBot from "../images/wave-bot.png";
import waveMid from "../images/wave-mid.png";
import Header from "../components/header";
import Portfolio from "../components/portfolio";
import NftDetail from "../components/nft-detail";
import Marketplace from "../components/marketplace";
import WhitePaper from "../components/white-paper";

export default function Main() {
  const { pathname } = useLocation();

  const componentShow = () => {
    const path = pathname.toString();
    switch (path) {
      case "/":
        return <Intro />;
      case "/app":
        return <Home />;
      case "/portfolio":
        return <Portfolio />;
      case "/marketplace":
        return <Marketplace />;
      case "/nft-detail":
        return <NftDetail />;
      case "/white-paper":
        return <WhitePaper />;
      default:
        return <Outlet />;
    }
  };

  return (
    <div className="App">
      <div className="waveWrapper waveAnimation">
        <div className="waveWrapperInner bgTop">
          <div
            className="wave waveTop"
            style={{ backgroundImage: `url(${waveTop})` }}
          ></div>
        </div>
        <div className="waveWrapperInner bgMiddle">
          <div
            className="wave waveMiddle"
            style={{ backgroundImage: `url(${waveMid})` }}
          ></div>
        </div>
        <div className="waveWrapperInner bgBottom">
          <div
            className="wave waveBottom"
            style={{ backgroundImage: `url(${waveBot})` }}
          ></div>
        </div>
      </div>
      <Header />
      {componentShow()}
    </div>
  );
}
