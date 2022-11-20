import { toast } from "react-toastify";
import moment from "moment";

export function FormatDate(value) {
  return moment(new Date(value)).format("DD/MM/YYYY");
}

export function ToastDismiss(id = "SW") {
  toast.dismiss(id);
}

export function ToastProgress(message, id = "SW") {
  toast.dismiss(id);
  toast.info(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: "colored",
    toastId: `${id}`,
    draggable: false,
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
  });
}

export function ToastSuccess(message = "Success", id = "SW") {
  toast.dismiss(id);
  toast.success(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: "colored",
    toastId: `${id}`,
    draggable: false,
    autoClose: 3000,
  });
}

export function ToastError(message = "Error", id = "SW") {
  toast.dismiss(id);
  toast.error(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    theme: "colored",
    toastId: `${id}`,
    draggable: false,
    autoClose: 3000,
  });
}

export function ToastUpdate(type, message, id = "SW") {
  toast.dismiss(id);
  toast.update(`${id}`, {
    render: message,
    type: type === "SUCCESS" ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
    draggable: false,
    toastId: `${id}`,
    autoClose: 3000,
  });
}
