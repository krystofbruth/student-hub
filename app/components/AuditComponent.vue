<template>
  <Card>
    <div class="flex flex-col gap-2">
      <h2 class="font-bold">Audit</h2>
      <section class="flex flex-col gap-2">
        <Stat
          color="var(--color-green-700)"
          :value="123"
          label_key="events_synced"
        />
        <Stat
          color="var(--color-red-700)"
          :value="123"
          label_key="events_synced"
        />
      </section>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from "./cards/Card.vue";
import Stat from "./utilities/Stat.vue";
</script>
