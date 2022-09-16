const getLocalDepositData = (): DepositData => {
    const powDepositId = window.localStorage.getItem("powDepositId"),
      powDepositInclusionBlock = window.localStorage.getItem(
        "powDepositInclusionBlock"
      ),
      powDepositAmount = window.localStorage.getItem("powDepositAmount");

    return {
      powDepositId,
      powDepositInclusionBlock,
      powDepositAmount,
    } as DepositData;
  },
  setLocalDepositData = (depositData: DepositData) => {
    window.localStorage.setItem("powDepositId", depositData.powDepositId);
    window.localStorage.setItem(
      "powDepositInclusionBlock",
      depositData.powDepositInclusionBlock
    );
    window.localStorage.setItem(
      "powDepositAmount",
      depositData.powDepositAmount
    );
  },
  clearLocalDepositData = () => {
    window.localStorage.removeItem("powDepositId");
    window.localStorage.removeItem("powDepositInclusionBlock");
    window.localStorage.removeItem("powDepositAmount");
  };

const getLocalWithdrawalData = (): WithdrawalData => {
    return {
      posWithdrawalId: window.localStorage.getItem("posWithdrawalId"),
      posWithdrawalAmount: window.localStorage.getItem("posWithdrawalAmount"),
      posWithdrawalInclusionBlock: window.localStorage.getItem(
        "posWithradawalInclusionBlock"
      ),
    } as WithdrawalData;
  },
  setLocalWithdrawalData = (withdrawalData: WithdrawalData) => {
    window.localStorage.setItem(
      "posWithdrawalId",
      withdrawalData.posWithdrawalId
    );
    window.localStorage.setItem(
      "posWithdrawalAmount",
      withdrawalData.posWithdrawalAmount
    );
    window.localStorage.setItem(
      "posWithdrawalInclusionBlock",
      withdrawalData.posWithdrawalInclusionBlock
    );
  },
  clearLocalWithdrawalData = () => {
    window.localStorage.removeItem("posWithdrawalId");
    window.localStorage.removeItem("posWithdrawalAmount");
    window.localStorage.removeItem("posWithdrawalInclusionBlock");
  };

export default function useLocalDepositData() {
  const getData = (): DepositData =>
      getLocalDepositData() || ({} as DepositData),
    isThereUnclaimedDeposit = () => {
      const { powDepositId, powDepositInclusionBlock, powDepositAmount } =
        getData();
      return Boolean(
        powDepositId && powDepositInclusionBlock && powDepositAmount
      );
    };

  return {
    isThereUnclaimedDeposit,
    getData,
    setData: setLocalDepositData,
    clearData: clearLocalDepositData,
  };
}

export function useLocalWithdrawalData() {
  return {
    getData: () => getLocalWithdrawalData(),
    setData: setLocalWithdrawalData,
    clearData: clearLocalWithdrawalData,
  };
}

export type DepositData = {
  powDepositId: string;
  powDepositInclusionBlock: string;
  powDepositAmount: string;
};

export type WithdrawalData = {
  posWithdrawalId: string;
  posWithdrawalAmount: string;
  posWithdrawalInclusionBlock: string;
};
