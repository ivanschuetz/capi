import { useEffect, useState } from "react"
import { MyDaoJs } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { ContentTitle } from "./ContentTitle"
import { MyDaoItem, MyDaoCreateItem } from "./MyDaoItem"

export const MyDaos = ({ deps }: { deps: Deps }) => {
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

const MyDaosEntries = ({ myDaos }: { myDaos: MyDaoJs[] }) => {
  var elements = myDaos ? myDaos.map((dao) => <MyDaoItem dao={dao} />) : []
  elements.push(<MyDaoCreateItem />)
  return myDaos && <div className="mt-10 flex flex-wrap gap-10">{elements}</div>
}

const updateMyDaos = (deps: Deps, setMyDaos: (daos: MyDaoJs[]) => void) => {
  useEffect(() => {
    if (deps.wasm && deps.myAddress) {
      safe(deps.notification, async () => {
        const myDaosRes = await deps.wasm.myDaos({
          address: deps.myAddress,
        })
        console.log("myDaosRes: " + JSON.stringify(myDaosRes))
        setMyDaos(myDaosRes.daos)
      })
    }
  }, [deps.wasm, deps.notification, deps.myAddress])
}
