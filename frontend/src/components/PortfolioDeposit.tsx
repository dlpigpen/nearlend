import PortfolioDepositItem from "./PortfolioDepositItem";

export default function PortfolioDeposit({
  supplied,
  borrowed,
  collateral,
}: any) {
  const render = () => {
    const supplied_ids = supplied && supplied.map((item: any) => item.token_id);
    const collateral_ids =
      collateral && collateral.map((item: any) => item.token_id);
    var merge_ids = supplied_ids?.concat(collateral_ids);
    var sum_ids = merge_ids?.filter(
      (item: any, pos: number) => merge_ids.indexOf(item) === pos
    );
    sum_ids?.forEach((id: any) => {
      const found = supplied_ids?.includes(id);
      if (!found) {
        supplied.push({
          apr: "0.0",
          balance: "0",
          shares: "0",
          token_id: id,
        });
      }
    });
    return supplied && supplied.length > 0 ? (
      supplied.map((item: any, idx: number) =>
        item ? (
          <PortfolioDepositItem
            key={idx}
            itemToken={item}
            borrowed={borrowed}
          />
        ) : null
      )
    ) : (
      <div className="empty-account-line"></div>
    );
  };

  return <div>{render()}</div>;
}
