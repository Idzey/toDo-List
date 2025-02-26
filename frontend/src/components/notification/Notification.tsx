import { notification } from "antd";

const openSuccessNotification = (title: string) => {
  notification.success({
    message: `Succes, ${title.toLocaleLowerCase()}!`,
    placement: "bottomRight",
  });
};

const openErrorNotification = (title: string) => {
  notification.error({
    message: `Error, ${title.toLocaleLowerCase()}!`,
    placement: "bottomRight",
  });
};

export {
  openSuccessNotification,
  openErrorNotification
}