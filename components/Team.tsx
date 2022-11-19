import React, { useEffect, useState } from "react"
import { SubmitButton } from "./SubmitButton"
import twitter from "../images/svg/twitter.svg"
import { ContentTitle } from "./ContentTitle"
import { AddTeamMember } from "./AddTeamMember"
import { safe } from "../functions/utils"
import { Deps } from "../context/AppContext"

export const Team = ({ deps }) => {
  const [team, setTeam] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  updateTeam(deps, setTeam)

  return (
    <div className="mt-80">
      <ContentTitle title={"Team"} />
      {!deps.dao?.team_url && <EmptyTeamView deps={deps} />}
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

const TeamMembers = ({ team }) => {
  return team.map((member) => <TeamMember key={member.uuid} data={member} />)
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

const SocialLink = ({ url }) => {
  return (
    <a href={url}>
      <SocialMediaImage url={url} />
    </a>
  )
}

const SocialMediaImage = ({ url }) => {
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

const updateTeam = (deps: Deps, setTeam) => {
  useEffect(() => {
    if (deps.wasm && deps.dao?.team_url) {
      safe(deps.notification, async () => {
        const team = await deps.wasm.bridge_get_team({
          url: deps.dao?.team_url,
        })
        console.log({ team })
        setTeam(team.team)
      })
    }
  }, [deps.wasm, deps.dao?.team_url, deps.notification])
}
