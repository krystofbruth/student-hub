<template>
  <div class="flex flex-col gap-5">
    <h1>{{ $t("pages.integrations.title") }}</h1>

    <article
      class="bg-accented rounded-md p-3 box-border flex flex-col gap-2.5"
    >
      <h2 class="text-xl font-bold">
        {{ $t("pages.integrations.my-sources") }}
      </h2>
      <section class="flex flex-col md:flex-row gap-5">
        <section class="grow order-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <SourceCard
            v-for="source in mySources"
            :key="source._id"
            :source="source"
            @unlink="handleSourceUnlink"
          ></SourceCard>
        </section>
        <aside class="order-0 md:order-2 md:min-w-[300px]">
          <AuditComponent />
        </aside>
      </section>
    </article>

    <section class="flex flex-col md:flex-row gap-5">
      <article class="flex flex-col grow basis-0 gap-2">
        <h2 class="text-xl font-bold">
          {{ $t("pages.integrations.available-schools") }}
        </h2>
        <p>{{ $t("pages.integrations.schools-description") }}</p>
        <!-- TODO: Search, query must be implemented on the backend! -->
        <!-- <UInput
          :placeholder="
            $t('pages.integrations.school-search.query-placeholder')
          "
          v-model="partnerInstitutionsSearch"
          @input="fetchPartnerSchools"
        /> -->
        <!-- <p v-if="partnerInstitutions.length === 0">
          {{ $t("pages.integrations.school-search.no-items-found") }}
        </p> -->
        <section class="flex flex-col gap-2">
          <SchoolCard v-for="partnerInstitution in partnerInstitutions" />
        </section>
      </article>
      <article class="flex flex-col gap-2.5 grow basis-0">
        <h2 class="text-xl font-bold">
          {{ $t("pages.integrations.available-integrations") }}
        </h2>
        <section class="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
          <OriginCard
            v-for="origin in origins"
            :key="origin._id"
            :origin="origin"
          />
        </section>
      </article>
    </section>
    <OriginCreationDialog></OriginCreationDialog>
  </div>
</template>

<script setup lang="ts">
import AuditComponent from "~/components/AuditComponent.vue";
import SchoolCard from "~/components/cards/SchoolCard.vue";
import SourceCard from "~/components/cards/SourceCard.vue";
import type { SourceView } from "~~/shared/types/ListSourcesResponse";
import OriginCard from "~/components/cards/OriginCard.vue";
import OriginCreationDialog from "~/components/dialogs/OriginCreationDialog.vue";

const mySources = ref<SourceView[]>([]);
const toast = useToast();
const authStore = useAuthorizationStore();
const partnerInstitutions = ref<ProviderView[]>([]);
const partnerInstitutionsSearch = ref("");
const origins = ref<OriginView[]>([]);

const fetchMySources = async () => {
  try {
    const authorization = await authStore.getAuthorization();
    if (!authorization) return;

    const res = await $fetch("/api/source", {
      headers: { Authorization: authorization },
    });
    if (!res.success) throw res;

    mySources.value = res.data;
  } catch (error) {
    if (error instanceof Response) {
      toast.add({
        title: $t("toasts.errors.unknown.title"),
        description: $t("toasts.errors.unknown.description"),
        color: "error",
      });
    } else {
      toast.add({
        title: $t("toasts.errors.network.title"),
        description: $t("toasts.errors.network.description"),
        color: "error",
      });
    }
  }
};

const fetchPartnerSchools = async () => {
  try {
    const res = await $fetch(
      `/api/provider?partnership=true&query=${partnerInstitutionsSearch.value}`,
      { method: "GET" },
    );
    if (!res.success) throw res;

    partnerInstitutions.value = res.data;
  } catch (error) {
    if (error instanceof Response) {
      toast.add({
        title: $t("toasts.errors.unknown.title"),
        description: $t("toasts.errors.unknown.description"),
        color: "error",
      });
    } else {
      toast.add({
        title: $t("toasts.errors.network.title"),
        description: $t("toasts.errors.network.description"),
        color: "error",
      });
    }
  }
};

const fetchOrigins = async () => {
  try {
    const res = await $fetch("/api/origin", { method: "GET" });
    if (!res.success) throw res;

    origins.value = res.data;
  } catch (error) {
    if (error instanceof Response) {
      toast.add({
        title: $t("toasts.errors.unknown.title"),
        description: $t("toasts.errors.unknown.description"),
        color: "error",
      });
    } else {
      toast.add({
        title: $t("toasts.errors.network.title"),
        description: $t("toasts.errors.network.description"),
        color: "error",
      });
    }
  }
};

const handleSourceUnlink = async () => {
  // TODO
};

onMounted(() => {
  fetchMySources();
  fetchPartnerSchools();
  fetchOrigins();
});
</script>
