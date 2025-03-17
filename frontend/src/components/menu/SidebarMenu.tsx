import {
  CalendarOutlined,
  HomeOutlined,
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router";
import ModalAuth from "../modal/ModalAuth";
import { useState } from "react";
import { openSuccessNotification } from "../notification/Notification";
import useUserStore from "../../store/user";
import userService from "../../services/userService";

const SidebarMenu = () => {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logoutUser } = useUserStore();

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    user
      ? {
          key: "account",
          label: <Link to="/account">Account</Link>,
          icon: <UserOutlined />,
        }
      : null,
    user
      ? {
          key: "calendar",
          label: <Link to="/calendar">Calendar</Link>,
          icon: <CalendarOutlined />,
        }
      : null,
    user
      ? {
          key: "logout",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: () => {
            userService.logoutUser();
            logoutUser();
            openSuccessNotification("you have logged out");
          },
        }
      : null,
    !user
      ? {
          key: "singup",
          label: "Sign up",
          icon: <KeyOutlined />,
          onClick: () => setSignupOpen(true),
        }
      : null,
    !user
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
