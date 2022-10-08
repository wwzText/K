import Web3 from 'web3';
import Request from './request';
import ABI from './usdtABI.json';
import { useTabbarStore, useUserInfoStore } from '../store';

const ethereum = (window as any).ethereum;
const BNB_CHAINID = '0x38'

let web3 = (window as any).web3;
web3 = new Web3(web3.currentProvider);

// const TO = "0x2F744BE3E68798BDa7e4E7c2c634542fa385280f" // 公地址
// const FROM = '0x3B41A570D301Dafb8F0BE6DDF5dbc8CAB421Fbad' // 私地址
const token = '0x55d398326f99059ff775485246999027b3197955'; // usdt
// const API_KEY = 'W5TXTHVWH9XQQVKP89W68G5WGBB5EH8BEJ';


let USDT_CONTRACT: any = new web3.eth.Contract(ABI, token);

const userInfoStore = useUserInfoStore();
const tabbarStore = useTabbarStore()

const handleAccountsChanged = (addressList: string[]) => {
  userInfoStore.$state.address = addressList[0];
}

/**
 * 初始化钱包地址
 */
export const installWeb3 = () => {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
}

ethereum.on('accountsChanged', (res: string[]) => {
  handleAccountsChanged(res);
  window.location.href = ''
  tabbarStore.$state.tabbarActive = 0
})

/**
 * 发起交易
 * @param {string | number} amount 交易数量 
 */
export const sendTransaction = async (amount: number = 0.001, to_address: string) => {
  if (!to_address) {
    let result = await Request({
      url: "user/my_wallet",
      data: {
        address: userInfoStore.address
      }
    })
    to_address = result.get_address;
    userInfoStore.$state.from_address = result.get_address;
  }

  let decimal = await USDT_CONTRACT.methods.decimals().call();

  let amountToSend = amount * Math.pow(10, decimal);
  let number = amountToSend.toLocaleString('fullwide', {
    useGrouping: false
  })

  return new Promise(resolve => {
    USDT_CONTRACT.methods
      .transfer(to_address, number)
      .send({ from: userInfoStore.address },
        function (err: any, res: any) {
          if (err) {
            resolve(false)
            return
          }
          resolve(res)
        })

  })
}


/**
 * 添加链
 */
const addEthereumChain = () => {
  // 返回 null 表示成功
  ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
      chainId: BNB_CHAINID,
      chainName: "BNB",
      rpcUrls: ['https://bsc-dataseed1.binance.org/']
    }]
  }).then((res: null) => { })
    .catch((err: any) => { })
}

// 切换链
const checkoutToBNB = async () => {
  ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: BNB_CHAINID }],
  }).then((res: null): void => {

  }).catch(() => addEthereumChain())
}

const approve = async () => {

}

// sendTransaction()