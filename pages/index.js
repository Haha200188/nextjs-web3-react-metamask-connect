import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { abi } from "../constants/abi.js"

export const injected = new InjectedConnector()

export default function Home () {
  const [hasMetamask, setHasMetmask] = useState(false)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetmask(true)
    }
  })

  const {
    active, // wallet is connected or not 
    activate, // the function for connecting wallet
    chainId, // current chain id
    account, // the address of the wallet connected
    library: provider
  } = useWeb3React()

  async function connect () {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected)
        setHasMetmask(true)
      } catch (e) {
        console.log(e)
      }
    }
  }

  async function execute () {
    if (active) {
      const signer = provider.getSigner()
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        await contract.store(88)
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <>
      {hasMetamask ? (active ? ("Connected!") : (<button onClick={() => connect()}>Connect</button>)) : ("Please install metamask")}
      {active ? <button onClick={() => execute()}>Execute</button> : ""}
    </>
  )
}
