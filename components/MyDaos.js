import React, { useState, useEffect } from "react"
import { loadMyDaos } from "../controller/my_daos"
import { MyDaoItem } from "./MyDaoItem"
import { ContentTitle } from "./ContentTitle"
import { MyDaoCreateItem } from "./MyDaoCreateItem"

export const MyDaos = ({ deps }) => {
  const [myDaos, setMyDaos] = useState([])

  useEffect(() => {
    if (deps.wasm && deps.myAddress) {
      loadMyDaos(deps.wasm, deps.statusMsg, deps.myAddress, setMyDaos)
    }
  }, [deps.wasm, deps.statusMsg, deps.myAddress])

  const myDaosView = () => {
    var elements = myDaos ? myDaos.map((dao) => <MyDaoItem dao={dao} />) : []
    elements.push(<MyDaoCreateItem />)
    return myDaos && <div className="my-daos-container mt-40">{elements}</div>
  }

  const view = () => {
    return (
      <div>
        <ContentTitle title="My projects" />
        {myDaosView()}
      </div>
    )
  }

  return <div>{view()}</div>
}
