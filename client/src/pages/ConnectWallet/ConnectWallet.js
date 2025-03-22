import React, { useContext, useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import globalContext from './../../context/global/globalContext'

import socketContext from '../../context/websocket/socketContext'
import { CS_FETCH_LOBBY_INFO } from '../../pokergame/actions'
import './ConnectWallet.scss'
import Navbar from '../../components/navigation/Navbar';
import MainPage from '../MainPage';
import NavMenu from '../../components/navigation/NavMenu';
import modalContext from '../../context/modal/modalContext';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Fortmatic from 'fortmatic';
import Portis from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: { infuraId: 'KEY_INFURA' },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Crypto Oasis',
      infuraId: 'KEY_INFURA',
    },
  },
  fortmatic: {
    package: Fortmatic,
    options: { key: 'KEY_FORMATIC' },
  },
  portis: {
    package: Portis,
    options: {
      id: 'ID_PORTIS',
    },
  },
};

export const WALLETS = [
  { name: 'MetaMask', icon: '/icons/metamask.svg' },
  { name: 'WalletConnect', icon: '/icons/walletconnect.svg' },
  { name: 'Coinbase Wallet', icon: '/icons/coinbase.svg' },
  { name: 'Fortmatic', icon: '/icons/fortmatic.svg' },
  { name: 'Portis', icon: '/icons/portis.svg' },
];

const ConnectWallet = () => {
  const { setWalletAddress, setChipsAmount } = useContext(globalContext)
   
  const { socket } = useContext(socketContext)
  const [openNavMenu, setOpenNavMenu] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const { openModal, closeModal } = useContext(modalContext);
  const useQuery = () => new URLSearchParams(location.search);
  let query = useQuery()

  useEffect(() => {
    if(socket !== null && socket.connected === true){
      const walletAddress = query.get('walletAddress')
      const gameId = query.get('gameId')
      const username = query.get('username')
      if(walletAddress && gameId && username){
        console.log(username)
        setWalletAddress(walletAddress)
        socket.emit(CS_FETCH_LOBBY_INFO, { walletAddress, socketId: socket.id, gameId, username })
        console.log(CS_FETCH_LOBBY_INFO, { walletAddress, socketId: socket.id, gameId, username })
        navigate('/play')
      }
    }
  }, [socket])

  const connectWallet = useCallback(async (providerName) => {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
    });
  
    try {
      const instance = await web3Modal.connectTo(providerName);
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
  
      console.log('Connected address:', address);
  
    } catch (error) {
      console.error('Error while connecting wallet:', error);
    }
  }, []);

  return (
    <>
      <Navbar location={location} loggedIn chipsAmount={0} openNavMenu={() => setOpenNavMenu(!openNavMenu)} />
      {
        openNavMenu && <NavMenu openModal={openModal} chipsAmount={0} onConnectWallet={connectWallet} onClose={() => setOpenNavMenu(false)} />
      }
      <MainPage />
    </>
  )
}

export default ConnectWallet
