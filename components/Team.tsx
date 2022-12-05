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

  const shouldShowEmptyView = () => {
    // no team added, or for some reason a team without members
    return (deps.dao && !deps.dao?.team_url) || (team && team.length === 0)
  }

  const shouldShowProgress = () => {
    // is loading the dao or is loading the team
    return !deps.dao || (deps.dao?.team_url && !team)
  }

  return (
    <div className="mt-80">
      <ContentTitle title={"Team"} />
      {shouldShowEmptyView() && <EmptyTeamView />}
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
      <div className={styles.add_member}>
        <button className="btn_no_bg" onClick={async () => setIsAdding(true)}>
          <img src={plus.src} alt="icon" />
        </button>
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

const EmptyTeamView = () => {
  return <div>{"No team yet"}</div>
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
