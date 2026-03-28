<template>
  <article
    class="w-full rounded-md bg-accented p-3 box-border flex flex-col gap-2"
  >
    <header class="w-full">
      <slot name="header" />
    </header>
    <section>
      <slot name="body"></slot>
    </section>
  </article>
</template>

<script setup lang="ts"></script>
