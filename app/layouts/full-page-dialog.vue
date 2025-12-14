<template>
  <div class="flex items-center justify-center w-full min-h-screen p-0">
    <div class="bg-accented flex radius rounded-md p-8 box-border w-2xl gap-4">
      <div class="shrink-0 grow basis-0">
        <div class="min-w-0 flex flex-col gap-5">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="basis-0.5 grow-0 bg-gray-400"></div>
      <div class="shrink-0 grow basis-0">
        <div class="min-w-0 flex flex-col gap-5">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
