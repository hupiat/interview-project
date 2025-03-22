import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'
import globalContext from './../../context/global/globalContext'

import socketContext from '../../context/websocket/socketContext'
import { CS_FETCH_LOBBY_INFO } from '../../pokergame/actions'
import './ConnectWallet.scss'
import Navbar from '../../components/navigation/Navbar';
import MainPage from '../MainPage';
import NavMenu from '../../components/navigation/NavMenu';

const ConnectWallet = () => {
  const { setWalletAddress, setChipsAmount } = useContext(globalContext)
   
  const { socket } = useContext(socketContext)
  const [openNavMenu, setOpenNavMenu] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <>
      <Navbar location={location} loggedIn chipsAmount={0} openNavMenu={() => setOpenNavMenu(!openNavMenu)} />
      {
        openNavMenu && <NavMenu openModal={openNavMenu} chipsAmount={0} onClose={() => setOpenNavMenu(false)} />
      }
      <MainPage />
    </>
  )
}

export default ConnectWallet
