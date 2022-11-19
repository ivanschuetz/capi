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
