import { useEffect, useState } from "react"
import { TeamMemberJs } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import twitter from "../images/svg/twitter.svg"
import { AddTeamMember } from "./AddTeamMember"
import { ContentTitle } from "./ContentTitle"
import { SubmitButton } from "./SubmitButton"

export const Team = ({ deps }: { deps: Deps }) => {
  const [team, setTeam] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  updateTeam(deps, setTeam)

  return (
    <div className="mt-80">
      <ContentTitle title={"Team"} />
      {!deps.dao?.team_url && <EmptyTeamView />}
      <TeamMembers team={team} />
      {deps.myAddress && (
        <SubmitButton
          label={"Add a member"}
          className="button-primary w-100"
          onClick={async () => setIsAdding(true)}
        />
      )}
      {isAdding && (
        <AddTeamMember
          deps={deps}
          prefillData={dummyPrefillData()}
          team={team}
          setTeam={setTeam}
          onAdded={() => setIsAdding(false)}
        />
      )}
    </div>
  )
}

const dummyPrefillData = () => {
  return {
    name: "Foo Bar",
    role: "Founder",
    descr:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
    picture: "https://placekitten.com/200/300",
    social: "https://twitter.com",
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

const TeamMember = ({ data }) => {
  return (
    <div>
      <img src={data.picture} alt="" />
      <div>{data.name}</div>
      <div>{data.role}</div>
      <div>{data.descr}</div>
      <div>
        {data.social_links.map((url) => (
          <SocialLink key={url} url={url} />
        ))}
      </div>
    </div>
  )
}

const SocialLink = ({ url }: { url: string }) => {
  return (
    <a href={url}>
      <SocialMediaImage url={url} />
    </a>
  )
}

const SocialMediaImage = ({ url }: { url: string }) => {
  var src
  if (url.includes("twitter")) {
    src = twitter.src
    // TODO other social media
  } else {
    // TODO generic link default
    src = twitter.src
  }
  return <img src={src} alt="" />
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
