import React, { useState, useEffect } from "react"
import { MyDaoItem } from "./MyDaoItem"
import { ContentTitle } from "./ContentTitle"
import { MyDaoCreateItem } from "./MyDaoCreateItem"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"

export const MyDaos = ({ deps }) => {
  const [myDaos, setMyDaos] = useState([])

  updateMyDaos(deps, setMyDaos)

  return (
    <div>
      <div>
        <ContentTitle title="My projects" />
        <MyDaosEntries myDaos={myDaos} />
      </div>
    </div>
  )
}

const MyDaosEntries = ({ myDaos }) => {
  var elements = myDaos ? myDaos.map((dao) => <MyDaoItem dao={dao} />) : []
  elements.push(<MyDaoCreateItem />)
  return myDaos && <div className="my-daos-container mt-40">{elements}</div>
}

const updateMyDaos = (deps: Deps, setMyDaos) => {
  useEffect(() => {
    ;(async () => {
      if (deps.wasm && deps.myAddress) {
        safe(deps.notification, async () => {
          const myDaosRes = await deps.wasm.bridge_my_daos({
            address: deps.myAddress,
          })
          console.log("myDaosRes: " + JSON.stringify(myDaosRes))
          setMyDaos(myDaosRes.daos)
        })
      }
    })()
  }, [deps.wasm, deps.notification, deps.myAddress])
}
