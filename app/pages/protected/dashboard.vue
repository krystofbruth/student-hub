<template>
  <div>
    <h1>Authorized person - hello!</h1>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea recusandae
      expedita, velit illo nam ratione earum quam optio, commodi unde pariatur
      sequi natus, deserunt eligendi autem temporibus quidem eius! Ab?
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthorizationStore } from "~/stores/AuthorizationStore";

const authorizationStore = useAuthorizationStore();
const authorization = await authorizationStore.getAuthorization();
</script>
