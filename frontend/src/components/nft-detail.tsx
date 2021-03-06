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
import { Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommingSoon from "./Popup/CommingSoon";
import { Select } from "antd";

const { Option } = Select;

const optionsFake = ["BTC", "ETH", "NEO", "NEL", "ARK", "NEAR"];
const durationFake = ["3 Days", "7 Days", "30 Days", "1 Month", "1 Year"];

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

  function handleChange(value: any) {
    console.log(`selected ${value}`);
  }

  function handleChangeInput(value: any) {
    console.log(`selected ${value}`);
  }
  function handleChangeDurations(value: any) {
    console.log(`selected ${value}`);
  }
  
  function handleChangeAPR(value: any) {
    console.log(`selected ${value}`);
  }
  return (
    <main className="nft-detail">
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

              <div className="wrap-offer" style={{ padding: "24px 0 120px" }}>
                <div style={{ paddingBottom: "24px" }}>
                  <h3>Loan Value</h3>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "100%" }}>
                      <Input
                        style={{ width: "100%" }}
                        onChange={handleChangeInput}
                        type="number"
                        pattern="[0-9]*"
                      />
                    </div>
                    <div>
                      <Select
                        style={{ width: "100px" }}
                        defaultValue="BTC"
                        onChange={handleChange}
                      >
                        {optionsFake.map((item, idx) => (
                          <Option value={item} key={idx.toString()}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div style={{ paddingBottom: "24px" }}>
                  <h3>Repayment Value</h3>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "100%" }}>
                      <Input
                        style={{ width: "100%" }}
                        onChange={handleChangeInput}
                        type="number"
                        pattern="[0-9]*"
                      />
                    </div>
                    <div>
                      <Select
                        style={{ width: "100px" }}
                        defaultValue="NEL"
                        onChange={handleChange}
                      >
                        {optionsFake.map((item, idx) => (
                          <Option value={item} key={idx.toString()}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    paddingBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div style={{ minWidth: "100px" }}>
                    <h3>Durations</h3>
                    <div>
                      <Select
                        defaultValue="7 Days"
                        onChange={handleChangeDurations}
                        style={{ width: "100%" }}
                      >
                        {durationFake.map((item, idx) => (
                          <Option value={item} key={idx.toString()}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div style={{ marginLeft: "14px" }}>
                    <h3>APR</h3>
                    <Input.Group
                      compact
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Input
                        onChange={handleChangeAPR}
                        type="number"
                        pattern="[0-9]*"
                      />
                      <p
                        style={{
                          paddingLeft: "10px",
                        }}
                      >
                        %
                      </p>
                    </Input.Group>
                  </div>
                  <button className="button-basic">Make Offer</button>
                </div>
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
                <button className="button" onClick={() => setIsShowNoti(true)}>
                  Buy
                </button>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="wrap-comtfee">
              <div className="comtfee">
                <Input
                  className="comtfee-input"
                  placeholder="Write your comtfee..."
                />
                <div className="comtfee-button">
                  <Tooltip
                    className="comtfee-tooltip"
                    color={"#2196f3"}
                    title={
                      "Comtfee - comment with fee, to show your love with the Creator NFT !"
                    }
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                  <button className="button-basic">Comtfee</button>
                </div>
              </div>
              <div className="comtfee-item">
                <div className="comtfee-info">
                  <p className="comtfee-avatar">
                    <img src={nft_car} alt={nft_car} />
                  </p>
                  <p className="comtfee-name"> Charlie Cameo </p>
                  <p className="comtfee-tranfer">
                    has donate 4 NEAR for{" "}
                    <span className="comtfee-txt-normal">{data?.creator}</span>
                  </p>
                </div>
                <p className="comtfee-text">
                  ???? ???? ???? Your work like a charm !{" "}
                </p>
              </div>
              <div className="comtfee-item">
                <div className="comtfee-info">
                  <p className="comtfee-avatar">
                    <img src={nft_flow} alt={nft_flow} />
                  </p>
                  <p className="comtfee-name"> Hold to the m00n </p>
                  <p className="comtfee-tranfer">
                    has donate 0.4 NEL for{" "}
                    <span className="comtfee-txt-normal">{data?.creator}</span>
                  </p>
                </div>
                <p className="comtfee-text">
                  Everything would be better if more people were like you. ??????
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowNoti && <CommingSoon setTurnOff={_handleTurnOffNoti} />}
    </main>
  );
}
