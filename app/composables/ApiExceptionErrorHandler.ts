import { ApiException, AuthReason, Exception } from "~/types/Exceptions";
import { getRedirectToLoginPath } from "~/utils/loginRedirectPath";

export const useApiExceptionErrorHandler = () => {
  const toast = useToast();
  const router = useRouter();
  const i18n = useI18n();

  /** Handles API Exceptiosn, including UI feedback (toasts), possible redirects due to auth etc. */
  const handleException = (exception: Exception) => {
    if (!(exception instanceof ApiException)) {
      toast.add({
        title: i18n.t(`toasts.errors.unknown.title`),
        description: i18n.t(`toasts.errors.unknown.description`),
        color: "error",
      });
      return;
    }

    if (exception.reason === "authorization") {
      router.push(
        getRedirectToLoginPath(
          exception.details.authReason || AuthReason.AUTH_MISSING,
        ),
      );
      return;
    }

    let toastKey: string;

    if (
      exception.reason === "error_response" &&
      exception.details.response &&
      exception.details.response.status >= 500 &&
      exception.details.response.status <= 599
    ) {
      toastKey = "toasts.errors.server";
    } else {
      toastKey = "toasts.errors.unknown";
    }

    toast.add({
      title: i18n.t(`${toastKey}.title`),
      description: i18n.t(`${toastKey}.description`),
      color: "error",
    });
  };

  return { handleException };
};
