import styles from "./chart_label.module.sass"

export const ChartLabel = ({
  number,
  circleImg,
  text,
}: {
  number: string
  circleImg: any
  text: string
}) => {
  return (
    <div className="chartBlock">
      <div className={styles.number}>{number}</div>
      <div className="h-16px">
        <img src={circleImg} alt="" />
      </div>
      <div>{text}</div>
    </div>
  )
}
