import Link from "next/link"

export const DaoName = (props) => {
  return (
    <div id="content__title">
      <Link href={props.dao.dao_link}>{props.dao.name}</Link>
      {props.children}
    </div>
  )
}

export const ContentTitle = ({ title, children }) => {
  return (
    <div id="content__title">
      {title} {children}
    </div>
  )
}
