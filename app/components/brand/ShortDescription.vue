<template>
  <section v-if="$i18n.locale === 'en'">
    <p>
      StudentHub is a data aggregation platform for conveniently viewing all
      deadlines & information. <b>Never miss another announcement again!</b>
    </p>
  </section>
  <section v-else-if="$i18n.locale === 'cs'">
    <p>
      StudentHub je platforma pro sdružení veškerých studijních organizačních
      informací na jednom místě.
      <b>Už nikdy vám neunikne další termín odevzdání!</b>
    </p>
  </section>
</template>
