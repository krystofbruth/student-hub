<template>
  <NuxtLayout name="protected-layout">
    <div class="flex flex-col gap-5">
      <h1>{{ $t("pages.integrations.title") }}</h1>

      <article
        class="bg-accented rounded-md p-3 box-border flex flex-col gap-2.5"
      >
        <h2 class="text-xl font-bold">
          {{ $t("pages.integrations.my-sources") }}
        </h2>
        <section class="flex flex-col md:flex-row gap-5">
          <section
            class="grow order-1 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-3"
          >
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
            <ProviderCard
              v-for="partnerInstitution in partnerInstitutions"
              :provider-id="partnerInstitution._id"
            />
          </section>
        </article>
        <article class="flex flex-col gap-2.5 grow basis-0">
          <h2 class="text-xl font-bold">
            {{ $t("pages.integrations.available-integrations") }}
          </h2>
          <section class="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
            <OriginCard
              v-for="origin in origins"
              :key="origin._id"
              :origin="origin"
              @connected="fetchMySources"
            />
          </section>
        </article>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AuditComponent from "~/components/AuditComponent.vue";
import ProviderCard from "~/components/cards/ProviderCard.vue";
import SourceCard from "~/components/cards/SourceCard.vue";
import type {
  ListSourcesResponse,
  SourceView,
} from "~~/shared/types/ListSourcesResponse";
import OriginCard from "~/components/cards/OriginCard.vue";

definePageMeta({ middleware: "auth" });

const mySources = ref<SourceView[]>([]);
const toast = useToast();
const partnerInstitutions = ref<ProviderView[]>([]);
const partnerInstitutionsSearch = ref("");
const origins = ref<OriginView[]>([]);
const providerStore = useProviderStore();
const apiExceptionHandler = useApiExceptionErrorHandler();

const fetchMySources = async () => {
  const res = await request<undefined, ListSourcesResponse>("/api/source", {
    method: "GET",
    body: undefined,
    authRequired: true,
  });

  if (!res.success) {
    apiExceptionHandler.handleException(res.error);
    return;
  }

  mySources.value = res.data.data;
};

const fetchPartnerProviders = async () => {
  const res = await request<undefined, FetchProvidersResponse>(
    `/api/provider?partnership=true&query=${partnerInstitutionsSearch.value}`,
    { method: "GET", body: undefined, authRequired: false },
  );
  if (!res.success) {
    apiExceptionHandler.handleException(res.error);
    return;
  }

  partnerInstitutions.value = res.data.data;
};

const fetchOrigins = async () => {
  const res = await request<undefined, FetchOriginsResponse>(`/api/origin`, {
    method: "GET",
    body: undefined,
    authRequired: false,
  });
  if (!res.success) {
    apiExceptionHandler.handleException(res.error);
    return;
  }

  origins.value = res.data.data;
};

const handleSourceUnlink = async () => {
  // TODO
};

onMounted(() => {
  fetchMySources();
  fetchPartnerProviders();
  fetchOrigins();
});
</script>
