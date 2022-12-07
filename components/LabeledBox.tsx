export const LabeledBox = ({ label, children }) => {
  return (
    <div className="labeled_box">
      <div className="text-70 font-bold text-te md:mb-10 xl:text-80">
        {label}
      </div>
      <div className="border border-solid border-ne3 p-10">{children}</div>
    </div>
  )
}
