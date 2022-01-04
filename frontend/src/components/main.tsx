import { Outlet, useLocation } from "react-router-dom";
import Home from "../routes/home";
import Header from "../components/header";
import waveTop from '../images/wave-top.png';
import waveBot from '../images/wave-bot.png';
import waveMid from '../images/wave-mid.png';

export default function Main() {
  const { pathname } = useLocation();

  return (
    <div className="App">
      <div className="waveWrapper waveAnimation">
        <div className="waveWrapperInner bgTop">
          <div
            className="wave waveTop"
            style={{backgroundImage: `url(${waveTop})`}}
          ></div>
        </div>
        <div className="waveWrapperInner bgMiddle">
          <div
            className="wave waveMiddle"
            style={{backgroundImage: `url(${waveMid})`}}
          ></div>
        </div>
        <div className="waveWrapperInner bgBottom">
          <div
            className="wave waveBottom"
            style={{backgroundImage: `url(${waveBot})`}}
          ></div>
        </div>
      </div>
      <Header />
      {pathname && pathname.toString() === "/" ? <Home /> : <Outlet />}
    </div>
  );
}
