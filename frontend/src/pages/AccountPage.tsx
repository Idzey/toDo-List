import { Button, Divider, Result } from "antd";
import useUserStore from "../store/user";
import { Link, useNavigate } from "react-router";

const AccountPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  if (!user) {
    return <Result title="You don't login. Please, login or sign up." />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">
          <Link to="/">To-Do</Link> / Account
        </h1>
        <Button color="pink" variant="solid" onClick={() => navigate("/")}>Go home</Button>
      </div>
      <Divider className="border-b-1 border-b-gray-300" />

      <div>
        <h1 className="text-4xl">Hello, {user.username}!</h1>
      </div>
    </div>
  );
};

export default AccountPage;
