export const ContentTitle = ({ title, children }: ContentTitlePars) => {
  return (
    <div id="content__title">
      {title} {children}
    </div>
  )
}

type ContentTitlePars = {
  title: string
  children?: JSX.Element
}

export const Subtitle = ({ text }: { text: string }) => {
  return <div className="mb-8 text-50 font-bold text-te sm:text-60">{text}</div>
}
