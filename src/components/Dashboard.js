import React, { useState } from 'react'
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom'
import { BsXCircle, BsCheckCircle } from 'react-icons/bs'


function LogoutButton() {

  return (
    <div className="logoutBox col-6">
      <button className="dmButton">Logout</button>
    </div>
  )
}

function BoardTile() {

  return (
    <div className="boardTile row">
      <div className="deleteButton col-12 d-flex my-2"><BsXCircle /></div>
      <div className="boardTitle col-10">Waterdeep Dragon Heist</div>
      <div className="enterButton col-2 d-flex"><BsCheckCircle /></div>
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
    </div>
  )
}

function CreateBoard() {

  return(
    <div className="col-6">
      <button className="dmButton">Add Board</button>
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

  return (
    <div className="userBlock pt-3 pb-3">
      <h2 className="dashTitle">Dungeon Master:</h2>
      <h3 className="dashUsername">Jeffrey_Evans</h3>
    </div>
  )
}

function SideBar() {

  return (
    <div className="sideBarColumn col-4 col-lg-2 d-flex">
      <UserBlock />
      <DmButtons />
      <BoardDisplay />
    </div>
  )
}

function MapImageView() {

  return (
    <div className="mapImageView col-11 my-4">
      <div >image</div>
    </div> 
  )
}

function MapTray() {

  return (
    <div className="mapTrayContainer col-8 col-lg-10  d-flex">
      <MapImageView />
    </div>
  )
}

function Dashboard({user, setUser }) {

  return (
    <div className="row dashboardRow">
      <SideBar />
      <MapTray />
    </div>
    
  )
}

export default Dashboard