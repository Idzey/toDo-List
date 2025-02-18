import { HomeOutlined, KeyOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router";
import ModalAuth from "../modal/ModalAuth";
import { useState } from "react";
import useUserStore from "../../store/user";
import taskService from "../../services/taskService";
import { openSuccessNotification } from "../notification/Notification";

const SidebarMenu = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { userToken, logoutUser } = useUserStore();

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    userToken
      ? {
          key: "account",
          label: <Link to="/account">Account</Link>,
          icon: <UserOutlined />,
        }
      : null,
    userToken ? {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        window.localStorage.removeItem("userToken");
        taskService.setToken("");
        logoutUser();
        openSuccessNotification("you have logged out");
      },
    } : null,
    !userToken
      ? {
          key: "singup",
          label: "Sign up",
          icon: <KeyOutlined />,
          onClick: () => setSignupOpen(true),
        }
      : null,
    !userToken
      ? {
          key: "login",
          label: "Login",
          icon: <UserOutlined />,
          onClick: () => setLoginOpen(true),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <Menu
        theme="dark"
        defaultSelectedKeys={["home"]}
        mode="inline"
        items={menuItems}
      />

      <ModalAuth setOpen={setLoginOpen} open={loginOpen} login={true} />
      <ModalAuth setOpen={setSignupOpen} open={signupOpen} login={false} />
    </>
  );
};

export default SidebarMenu;
