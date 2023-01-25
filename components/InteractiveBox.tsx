import poly1 from "../images/svg/poly1.svg"
import poly2 from "../images/svg/poly2.svg"
import poly3 from "../images/svg/poly3.svg"

// Box with the design used for interactive contents (a button somewhere).
// Note that this component doesn't add itself any interactive elements.
export const InteractiveBox = ({
  title,
  noTitleBottomMargin,
  children,
}: {
  title: string
  // true to not add the default bottom margin below the title
  noTitleBottomMargin?: boolean
  children: JSX.Element
}) => {
  const titleBottomMargin = noTitleBottomMargin ? "" : "mb-10"
  return (
    <div className="relative mt-20">
      <img src={poly1.src} title={null} className="absolute right-[25%]" />
      <img
        src={poly2.src}
        title={null}
        className="absolute right-[0%] bottom-0"
      />
      <img
        src={poly3.src}
        title={null}
        className="absolute right-[35%] bottom-0"
      />
      <div className="dao_action_active_tab box-container">
        <div className={`${titleBottomMargin} text-70 font-bold text-bg`}>
          {title}
        </div>
        {children}
      </div>
    </div>
  )
}
