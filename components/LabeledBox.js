export const LabeledBox = ({ label, children }) => {
  return (
    <div className="labeled_box">
      <div className="labeled_box_label">{label}</div>
      <div className="labeled_box_children">{children}</div>
    </div>
  );
};
