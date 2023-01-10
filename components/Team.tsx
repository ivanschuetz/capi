import { useEffect, useState } from "react"
import { TeamMemberInputs, TeamMemberJs } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { AddTeamMember } from "./AddTeamMember"
import { ContentTitle } from "./ContentTitle"
import { TeamMember } from "./TeamMember"
import styles from "./team.module.sass"
import plus from "../images/svg/plus_purple.svg"
import Modal from "../modal/Modal"
import { SetBool } from "../type_alias"
import Progress from "./Progress"

export const Team = ({ deps }: { deps: Deps }) => {
  const [team, setTeam] = useState<TeamMemberJs[] | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  updateTeam(deps, setTeam)

  const shouldShowProgress = () => {
    // is loading the dao or is loading the team
    return !deps.dao || (deps.dao?.team_url && !team)
  }

  return (
    <div className="mt-20">
      <ContentTitle title={"Team"} />
      {shouldShowProgress() && <Progress />}
      {/* the team view contains the "add member" button, so we show it too if there's no team */}
      {<TeamView deps={deps} team={team ?? []} setIsAdding={setIsAdding} />}
      {isAdding && (
        <Modal title={"Add team member"} onClose={() => setIsAdding(false)}>
          <AddTeamMember
            deps={deps}
            prefillData={dummyPrefillData()}
            team={team ?? []}
            setTeam={setTeam}
            onAdded={() => setIsAdding(false)}
          />
        </Modal>
      )}
    </div>
  )
}

/// shown if the project has a team
const TeamView = ({
  deps,
  team,
  setIsAdding,
}: {
  deps: Deps
  team: TeamMemberJs[]
  setIsAdding: SetBool
}) => {
  return (
    <div className={styles.grid}>
      <TeamMembers team={team} />
      <MaybeAddMemberButton deps={deps} setIsAdding={setIsAdding} />
    </div>
  )
}

const MaybeAddMemberButton = ({
  deps,
  setIsAdding,
}: {
  deps: Deps
  setIsAdding: SetBool
}) => {
  return (
    deps.myAddress && (
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-44 w-full items-center justify-center border-2 border-dashed border-te">
          <button className="btn_no_bg" onClick={async () => setIsAdding(true)}>
            <img className="cursor-pointer" src={plus.src} alt="icon" />
          </button>
        </div>
        <div className="mt-5 text-60 font-bold text-te">
          {"Add team member"}
        </div>
      </div>
    )
  )
}

const dummyPrefillData = (): TeamMemberInputs => {
  return {
    name: "Foo Bar",
    role: "Founder",
    descr:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    picture: "https://placekitten.com/200/300",
    github_link: "https://github.com",
    twitter_link: "https://twitter.com",
    linkedin_link: "https://linkedin.com",
  }
}

const TeamMembers = ({ team }: { team: TeamMemberJs[] }) => {
  return (
    <>
      {team.map((member) => (
        <TeamMember key={member.uuid} data={member} />
      ))}
    </>
  )
}

const updateTeam = (deps: Deps, setTeam: (team: TeamMemberJs[]) => void) => {
  useEffect(() => {
    if (deps.wasm && deps.dao?.team_url) {
      safe(deps.notification, async () => {
        const team = await deps.wasm.getTeam({
          url: deps.dao?.team_url,
        })
        console.log({ team })
        setTeam(team.team)
      })
    }
  }, [deps.wasm, deps.dao?.team_url, deps.notification])
}
