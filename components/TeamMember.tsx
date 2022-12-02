import twitter from "../images/svg/twitter.svg"

export const TeamMember = ({ data }) => {
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
