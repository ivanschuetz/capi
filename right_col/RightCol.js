import { MyAccount } from "../components/MyAccount";

export const RightCol = ({ deps }) => {
  return (
    <div id="rightcol">
      <MyAccount
        deps={deps}
        // no dao here
        daoId={null}
      />
    </div>
  );
};
