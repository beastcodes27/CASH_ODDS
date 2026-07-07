let toastRef = null;

export function setToastRef(ref) {
  toastRef = ref;
}

export const toast = {
  show: (message, options = {}) => {
    if (toastRef) toastRef.showToast(message, options);
  },
  success: (message, options = {}) => {
    if (toastRef) toastRef.success(message, options);
  },
  error: (message, options = {}) => {
    if (toastRef) toastRef.error(message, options);
  },
  info: (message, options = {}) => {
    if (toastRef) toastRef.info(message, options);
  },
  warning: (message, options = {}) => {
    if (toastRef) toastRef.warning(message, options);
  },
};
