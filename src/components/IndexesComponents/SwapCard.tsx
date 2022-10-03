import { useEffect } from "react";
import { useWeb3React } from '@web3-react/core';
import { ETHER, Token } from "@uniswap/sdk";
import Web3 from "web3";
import { getCoinBalance } from "../../hooks/loadBalance";
import { BigNumber } from "@0x/utils";
import InputDecimal from "./inputDecimal";
import { toNumber } from "lodash";

function SwapCard(props: any) {

  function openModal() {
    props.setSide(props.side);
    props.setShow(!props.show)
  }

  const { account, active, library, chainId } = useWeb3React();

  useEffect(() => {
    (async () => {
      let currency;
      if (props.selected && props.selected.symbol) {
        currency = { address: props.selected.address, symbol: props.selected.symbol };
      }
      let selectedCurrencyBalance = await getCoinBalance(
        account ?? undefined,
        active,
        library,
        props.selected && props.selected.symbol === "ETH" && props.selected.symbol ? ETHER : currency
      );
      props.onChangeBalance(selectedCurrencyBalance, props.side);
    })()

  }, [props.address, chainId, account, props.buySellState]);

  function getDispBalance(val: any) {
    if (props.selected.decimals) {
      return parseFloat(val) / (10 ** props.selected.decimals);
    } else {
      return Web3.utils.fromWei(new BigNumber(val).toString(), 'ether');
    }
  }


  const html = <div className={props.side === "from" ? "card card-from" : "card card-to mt-2"}  >
    <div className="card-body">
      <p className="card-title">
        <small> {props.side === "from" ? props.buySell : props.buySell === "Buy" ? "Pay with" : "Receive with"}</small>
        {active ? <small className="float-right">Balance: {(() => {
          let balance = props.balance;
          let newBalance = getDispBalance(balance);
          return toNumber(newBalance).toFixed(5);
        })()}</small> : ""}
      </p>

      {props.side === "to" ?
        <p className="card-title mt-3 select-input-container">
          {
            props.selected && props.selected.symbol ? <span className="selector" onClick={openModal}>
              <img src={props.selected.logoURI} width="40px" alt="" className="mb-4" /> <span className="h1"> {props.selected.symbol}</span> <i className="fa fa-chevron-down icon-left" />
            </span> : <span className="selector" onClick={openModal}>
              <span className="h1"> Select Coin</span> <i className="fa fa-chevron-down icon-left" />
            </span>
          }

          {/* <span className="selector" >
            <img src={props.selected.image} alt="" className="mb-4" /> <span className="h1"> {props.selected.symbol}</span>
          </span> */}
          <InputDecimal
            className="float-right Curr-input"
            fontStyle={(props.rate && Number(props.val)) ? (props.rate * props.val).toFixed(5).length > 8 : false}
            disabled={true}
            val={(props.val && props.rate) ? Number(parseFloat(props.val) * parseFloat(props.rate)).toFixed(8) : "0"}
            updatevalue={(v: any) => props.handleValue(v, props.side)} />
        </p> : <p className="card-title mt-3 select-input-container">

          <span className="selector" >
            <img src={props.selected.image} width="40px" alt="" className="mb-4" /> <span className="h1"> {props.selected.symbol}</span>
          </span>
          <InputDecimal
            className="float-right Curr-input"
            fontStyle={(props.rate && Number(props.val)) ? (props.rate * props.val).toFixed(5).length > 8 : false}
            disabled={false}
            val={props.val}
            updatevalue={(v: any) => props.handleValue(v, props.side)} />
        </p>
      }


      <p className="card-title">
        {props.selected ? <small>{props.selected.name}</small> : ""}
        {props.from && props.rate && props.to && props.side !== "from" ? <small className="float-right">1 {props.from.symbol} ~= {parseFloat(props.rate).toFixed(8)} {props.to.symbol}</small> : ""}
      </p>
    </div>
    {props.side === "from" ? <div className="text-center">
      <img src="/assets/img/swap.png" alt="" className="img-fluid swap-button" />
    </div> : ""}

  </div>

  return html;

}

export default SwapCard;