import { useState as hookState, Downgraded } from "@hookstate/core";
import globalState from "../../state/globalStore";
import { handleDepositFirstTime } from "../../services/connect";

type Props = {
  setTurnOff: Function;
  tokenId?: string;
  token?: any;
};

const RegistFirstTime = ({ setTurnOff }: Props) => {
  const { contract, wallet }: any = hookState<any>(globalState);
  const contractState = contract.attach(Downgraded).get();
  const walletState = wallet.attach(Downgraded).get();

  const _handleTurnOff = () => {
    setTurnOff();
  };
  const _handleDeposit = () => {
    handleDepositFirstTime(contractState, walletState);
  };

  return (
    <div className="wrap-popup">
      <div className="popup notification">
        <h4 className="text-notification">
          You need to <strong>register</strong> to deposit or borrow !
        </h4>
        <p className="text-notification">
          Fee: <strong>0.1 NEAR</strong>
        </p>
        <div className="wrap-button">
          <button className="button-notification" onClick={_handleDeposit}>
            Deposit
          </button>
          <button
            className="button-notification button-gray"
            onClick={_handleTurnOff}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistFirstTime;
