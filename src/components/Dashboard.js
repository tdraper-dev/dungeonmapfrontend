import React, { useState } from 'react'
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom'
import { BsXCircle, BsCheckCircle } from 'react-icons/bs'
import { useAuth } from '../services/use-auth'


function LogoutButton() {
  const auth = useAuth()

  return (
    <div className="logoutBox col-6">
      <button className="dmButton" onClick={() => auth.logOut()}>Logout</button>
    </div>
  )
}


function PopUpNotice(props) {
  const [visible, setVisible] = useState(false)
  const { label, className } = props

  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className={`${className} my-2`}>
      {props.children}
      {visible ? <div className='popUpVisible'>{label}</div> : null }
    </div>
  )
}

function BoardTile() {

  return (
    <div className="boardTile row">
      <div className="boardTitle col-10">
        <div className="boardTitleText mt-4">Waterdeep Dragon Heist</div>
      </div>
      <div className="buttonContainer col-2 row">
        <PopUpNotice label='Delete Gameboard' className="deleteButton">
          <BsXCircle className="deleteIcon" />
        </PopUpNotice>
        <PopUpNotice label='Host Gameboard' className="enterButton">
          <Link className="toGameboardLink" to="/gameboard/123">
            <BsCheckCircle className="enterIcon"/>
          </Link>
        </PopUpNotice>
      </div>
    </div>
  )
}

function BoardDisplay() {

  return (
    <div className="boardsDisplay">
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />
      <BoardTile />

 
    </div>
  )
}

function CreateBoard() {

  return(
    <div className="col-6">
      <button className="dmButton" >Add Board</button>
    </div>
  )
}

function DmButtons() {

  return (
    <div className="dmButtonsBox d-flex">
      <CreateBoard />
      <LogoutButton />
    </div>
  )
}

function UserBlock() {
  const auth = useAuth()

  return (
    <div className="userBlock pt-1 pb-1 pt-lg-3 pb-lg-3 row">
      <div className="dashTitle col-12">Dungeon Master: <br />{auth.username}</div>
    </div>
  )
}

function SideBar() {

  return (
    <div className="sideBarColumn col-12 col-lg-2 d-flex">
      <UserBlock />
      <DmButtons />
      <BoardDisplay />
    </div>
  )
}

function MapImageView() {

  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <img className="mapImage img-fluid" alt='' src="https://d20.pub/assets/uploads/2018/03/Simple-battlemap-for-Hoard-of-the-Dragon-Queen-Dungeons-and-Dragons-Adventure-Module-Part-1-Keep-in-Greenest-on-Fire.jpg" />
      </div>

    </div> 
  )
}

function MapTray() {

  return (
    <div className="mapTrayContainer col-12 col-lg-10  d-flex">
      <MapImageView />
    </div>
  )
}

function Dashboard() {

  return (
    <div className="row dashboardRow">
      <SideBar />
      <MapTray />
    </div>
    
  )
}

export default Dashboard