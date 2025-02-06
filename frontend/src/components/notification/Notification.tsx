import { notification } from "antd";

const openSuccessNotification = (title: string) => {
  notification.success({
    message: `Succes, ${title}!`,
    placement: "bottomRight",
  });
};

const openErrorNotification = (title: string) => {
  notification.error({
    message: `Error, ${title}!`,
    placement: "bottomRight",
  });
};

export {
  openSuccessNotification,
  openErrorNotification
}