<template>
  <div>
    <p>Utility page, please wait for redirection...</p>
  </div>
</template>

<script setup lang="ts">
import { getOriginState } from "~/utils/integrations/teams/OriginState";
import type { CreateTeamsSourceCredentials } from "~~/shared/types/integrations/teams/AuthorizationFlow";

const router = useRouter();
const toast = useToast();

const redirect = "/integrations";

onMounted(async () => {
  const state = getOriginState();
  const code = router.currentRoute.value.query["code"];

  if (typeof code !== "string" || typeof state.originId !== "string") {
    toast.add({
      color: "error",
      title: $t("toasts.errors.source-registration.title"),
      description: $t("toasts.errors.source-registration.description"),
    });
    router.replace(redirect);
    return;
  }

  const credentials: CreateTeamsSourceCredentials = {
    authorizationToken: code,
  };

  const res = await request<CreateSourceRequest, CreateSourceResponse>(
    "/api/source",
    {
      method: "POST",
      body: {
        originId: state.originId,
        credentials,
      },
      authRequired: true,
    },
  );

  if (!res.success) {
    toast.add({
      color: "error",
      title: $t("toasts.errors.source-registration.title"),
      description: $t("toasts.errors.source-registration.description"),
    });
    router.replace(redirect);
  }

  toast.add({
    color: "success",
    title: $t("toasts.sources.creationSuccess.title"),
    description: $t("toasts.sources.creationSuccess.description"),
  });
  router.replace(redirect);
});
</script>
