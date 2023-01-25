import { TeamMemberJs } from "wasm/wasm"
import twitter from "../images/svg/twitter.svg"
import linkedin from "../images/svg/linkedin2.svg"
import github from "../images/svg/github.svg"
import styles from "./team_member.module.sass"

export const TeamMember = ({ data }: { data: TeamMemberJs }) => {
  return (
    <div className={styles.team_member}>
      <div className={styles.top_row}>
        <img className={styles.pic} src={data.picture} alt="" />
        <div className={styles.filler} />
        <div className={styles.social_links}>
          {maybeSocialLink(data.github_url)}
          {maybeSocialLink(data.twitter_url)}
          {maybeSocialLink(data.linkedin_url)}
        </div>
      </div>
      <div className={styles.name}>{data.name}</div>
      <div className={styles.role}>{data.role}</div>
      <div className="mt-8 mb-7 h-[1px] bg-ne3" />
      <div className={styles.descr}>{data.descr}</div>
    </div>
  )
}

const maybeSocialLink = (url?: string): JSX.Element | null => {
  if (url) {
    return <SocialLink key={url} url={url} />
  } else {
    return null
  }
}

const SocialLink = ({ url }: { url: string }) => {
  return (
    <a href={url} target="_blank">
      <SocialMediaImage url={url} />
    </a>
  )
}

const SocialMediaImage = ({ url }: { url: string }) => {
  var src: string
  if (url.includes("twitter")) {
    src = twitter.src
    // TODO other social media
  } else if (url.includes("linkedin")) {
    src = linkedin.src
  } else if (url.includes("github")) {
    src = github.src
  } else {
    // TODO generic link default
    src = twitter.src
  }
  return <img src={src} className="mr-2 w-6" alt="" />
}
