import bitcoin from "../images/token/bitcoin.png";
import nft_circle from "../images/nft_circle.jpeg";
import nft_car from "../images/nft_car.jpeg";
import nft_city from "../images/nft_city.jpeg";
import nft_samurai from "../images/nft_samurai.jpeg";
import nft_flow from "../images/nft_flow.jpeg";
import nft_hand from "../images/nft_hand.jpeg";
import arrow_back from "../images/arrow-back.svg";

import {
  HeartFilled,
  ShareAltOutlined,
  SwapLeftOutlined,
} from "@ant-design/icons";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommingSoon from "./Popup/CommingSoon";

export default function NftDetail() {
  const [data, setData]: any = useState(null);
  const [isShowNoti, setIsShowNoti]: any = useState(false);
  let { state }: any = useLocation();
  let navigate: any = useNavigate();

  useEffect(() => {
    if (state) {
      setData(state);
    }
  }, [state, data]);

  const _goBack = () => {
    navigate(-1);
  };

  const _handleTurnOffNoti = () => {
    setIsShowNoti(false);
  };

  return (
    <main className="nft-detail">
      {isShowNoti && <CommingSoon setTurnOff={_handleTurnOffNoti} />}
      <div className="wrap-body">
        <div className="nft-info">
          <div className="container">
            <div className="arrow-back" onClick={_goBack}>
              <SwapLeftOutlined />
            </div>
            <div className="wrap-img">
              {data?.type === "video" ? (
                <div className="img">
                  <video
                    className="video-background"
                    autoPlay={true}
                    loop
                    muted
                    playsInline
                    controls
                    src={data?.asset}
                  ></video>
                </div>
              ) : (
                <div
                  className="img"
                  style={{
                    background: `url('${data?.asset}') no-repeat center center / cover`,
                  }}
                ></div>
              )}
            </div>

            <div className="wrap-detail">
              <div className="top">
                <div className="title">
                  <h3 className="nft-name">{data?.name}</h3>
                  <div className="nft-type">Collectables</div>
                </div>
                <div className="like-share">
                  <div className="like-share-icon like">
                    20 <HeartFilled />
                  </div>
                  <div className="like-share-icon share">
                    <ShareAltOutlined />
                  </div>
                </div>
              </div>

              <div className="owner-info">
                <div className="wrap-owner">
                  <p className="token-icon">
                    <img
                      alt="token-icon"
                      src={bitcoin}
                      width={30}
                      height={30}
                    />
                  </p>
                  <div className="owner">
                    <p className="owner-title">Creator</p>
                    <p className="owner-name">{data?.creator}</p>
                  </div>
                </div>
                <div className="wrap-owner">
                  <p className="token-icon">
                    <img
                      alt="token-icon"
                      src={bitcoin}
                      width={30}
                      height={30}
                    />
                  </p>
                  <div className="owner">
                    <p className="owner-title">Owner</p>
                    <p className="owner-name">{data?.owner}</p>
                  </div>
                </div>
              </div>

              <div className="wrap-description">
                <p className="description">{data?.desc}</p>
              </div>

              <div className="wrap-button">
                <div className="price">
                  <div className="left-side">
                    <img
                      alt="token-icon"
                      src={data?.tokenImg}
                      width={24}
                      height={24}
                    />
                    <span className="token-icon-price">
                      {data?.price} {data?.token}{" "}
                    </span>
                  </div>
                  <div className="right-side">
                    <span
                      style={{ fontSize: 25, position: "relative", top: 3 }}
                    >
                      &#8771;
                    </span>
                    <span className="token-usd">150k usd</span>
                  </div>
                </div>
                <button className="button" onClick={() => setIsShowNoti(true)}>Buy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
