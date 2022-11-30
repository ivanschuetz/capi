import facebook from "../images/svg/facebook.svg"
import linkedin from "../images/svg/linkedin.svg"
import telegram from "../images/svg/telegram.svg"
import twitter from "../images/svg/twitter-white.svg"

const ShareView = ({ projectUrl }: { projectUrl: string }) => {
  const shareText = "Invest in my project!"

  return (
    <div className="modal-container">
      <div className="social-media-share facebook">
        <a href={facebookLink(projectUrl, shareText)}>
          <img src={facebook.src} alt="facebook" />
          <div className="title">Share with Facebook</div>
        </a>
      </div>
      <div className="social-media-share linkedin">
        <a href={linkedInLink(projectUrl, shareText)}>
          <img src={linkedin.src} alt="linkedin" />
          <div className="title">Share with LinkedIn</div>
        </a>
      </div>
      <div className="social-media-share twitter">
        <a href={twitterLink(projectUrl, shareText)}>
          <img src={twitter.src} alt="twitter" />
          <div className="title">Share with Twitter</div>
        </a>
      </div>
      {/*TODO telegram icon*/}
      <div className="social-media-share telegram">
        <a href={telegramLink(projectUrl, shareText)}>
          <img src={telegram.src} alt="telegram" />
          <div className="title">Share with Telegram</div>
        </a>
      </div>
    </div>
  )
}

export default ShareView

const twitterLink = (url: string, title: string) => {
  return (
    "https://twitter.com/share" +
    objectToGetParams({
      url,
      text: title,
    })
  )
}

const facebookLink = (url: string, title: string) => {
  return (
    "https://www.facebook.com/sharer/sharer.php" +
    objectToGetParams({
      u: url,
      quote: title,
    })
  )
}

const linkedInLink = (url: string, title: string) => {
  return (
    "https://linkedin.com/shareArticle" +
    objectToGetParams({
      url,
      mini: "true",
      title,
    })
  )
}

const telegramLink = (url: string, title: string) => {
  return (
    "https://telegram.me/share/url" +
    objectToGetParams({
      url,
      text: title,
    })
  )
}

function objectToGetParams(object: object) {
  const params = Object.entries(object).map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
  )

  return params.length > 0 ? `?${params.join("&")}` : ""
}
