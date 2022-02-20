import {SendOutlined} from "@ant-design/icons";
import {Button, Input, Tooltip} from "antd";
// import { useLookupAddress } from "eth-hooks/dapps/ens";
import React, {useCallback, useState, useEffect} from "react";
import Blockies from "react-blockies";
import {Transactor} from "../helpers";
import Wallet from "./Wallet";
import TextArea from "antd/es/input/TextArea";

const {utils} = require("ethers");

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

/*
  ~ What it does? ~

  Displays a local faucet to send ETH to given address, also wallet is provided

  ~ How can I use? ~

  <Faucet
    price={price}
    localProvider={localProvider}
    ensProvider={mainnetProvider}
    placeholder={"Send local faucet"}
  />

  ~ Features ~

  - Provide price={price} of ether and convert between USD and ETH in a wallet
  - Provide localProvider={localProvider} to be able to send ETH to given address
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
              works both in input field & wallet
  - Provide placeholder="Send local faucet" value for the input
*/

export default function Faucet(props) {
  const [address, setAddress] = useState();
  const [faucetAddress, setFaucetAddress] = useState();

  const {price, placeholder, localProvider, ensProvider, onChange} = props;

  useEffect(() => {
    const getFaucetAddress = async () => {
      if (localProvider) {
        const _faucetAddress = await localProvider.listAccounts();
        setFaucetAddress(_faucetAddress[0]);
        //console.log(_faucetAddress);
      }
    };
    getFaucetAddress();
  }, [localProvider]);

  let blockie;
  if (address && typeof address.toLowerCase === "function") {
    blockie = <Blockies seed={address.toLowerCase()} size={8} scale={4}/>;
  } else {
    blockie = <div/>;
  }

  // const ens = useLookupAddress(ensProvider, address);

  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined" && utils.isAddress(newValue)) {
        let newAddress = newValue;
        setAddress(newAddress);
      }
    },
    [ensProvider, onChange],
  );

  const airDrop = () => {
    const addressList = document.getElementById('addressList').value.split("\n");
    const filteredAddressList = addressList.filter((el) => el);
    console.log("filtered List", filteredAddressList);
    if (filteredAddressList.length > 0) {
      for (let i = 0; i < filteredAddressList.length; i++) {
        let eachAddress = filteredAddressList[i].trim();
        tx({
          to: eachAddress,
          value: utils.parseEther("0.01"),
        });
        setAddress("");
      }
    }
  };

  const tx = Transactor(localProvider);

  return (
    <div style={{textAlign: 'center'}}>
      {/*<Input*/}
      {/*  size="large"*/}
      {/*  placeholder={placeholder ? placeholder : "local faucet"}*/}
      {/*  prefix={blockie}*/}
      {/*  value={address}*/}
      {/*  // value={ens || address}*/}
      {/*  onChange={e => {*/}
      {/*    // setAddress(e.target.value);*/}
      {/*    updateAddress(e.target.value);*/}
      {/*  }}*/}
      {/*  suffix={*/}
      {/*    <Tooltip title="Faucet: Send local ether to an address.">*/}
      {/*      <Button*/}
      {/*        onClick={() => {*/}
      {/*          tx({*/}
      {/*            to: address,*/}
      {/*            value: utils.parseEther("0.01"),*/}
      {/*          });*/}
      {/*          setAddress("");*/}
      {/*        }}*/}
      {/*        shape="circle"*/}
      {/*        icon={<SendOutlined/>}*/}
      {/*      />*/}
      {/*    </Tooltip>*/}
      {/*  }*/}
      {/*/>*/}
      <TextArea placeholder={placeholder ? placeholder : "local faucet"} id="addressList" rows={10}>

      </TextArea>
      <Button style={{marginTop: '1em', width: '15%'}}
              onClick={airDrop}
              type={"primary"}
              icon={<SendOutlined/>}
      >Send</Button>
    </div>

  );
}
