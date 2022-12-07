// Box with the design used for interactive contents (a button somewhere).
// Note that this component doesn't add itself any interactive elements.
export const InteractiveBox = ({
  title,
  children,
}: {
  title: string
  children: JSX.Element
}) => {
  return (
    <div className="mt-20">
      <div className="dao_action_active_tab box-container">
        <div className="box_header_on_acc">{title}</div>
        {children}
      </div>
    </div>
  )
}
