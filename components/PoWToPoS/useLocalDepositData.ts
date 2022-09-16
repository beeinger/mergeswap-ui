const getLocalDepositData = () => {
    const powDepositId = window.localStorage.getItem("powDepositId"),
      powDepositInclusionBlock = window.localStorage.getItem(
        "powDepositInclusionBlock"
      ),
      powDepositAmount = window.localStorage.getItem("powDepositAmount");

    return { powDepositId, powDepositInclusionBlock, powDepositAmount };
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
    setData: setLocalDepositData,
    clearData: clearLocalDepositData,
    isThereUnclaimedDeposit,
    getData,
  };
}

export type DepositData = {
  powDepositId: string;
  powDepositInclusionBlock: string;
  powDepositAmount: string;
};
