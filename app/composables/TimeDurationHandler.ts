export const useTimeDurationHandler = () => {
  const i18n = useI18n();

  const getTimeLeftValue = (target: Date) =>
    computed(() => {
      const locale = i18n.locale.value;

      const deltaSeconds = (target.getTime() - Date.now()) / 1000;

      // const seconds = deltaSeconds % 60;
      const minutes = Math.floor(deltaSeconds / 60) % 60;
      const hours = Math.floor(deltaSeconds / 60 / 60) % 24;
      const days = Math.floor(deltaSeconds / 60 / 60 / 24) % 30;
      const months = Math.floor(deltaSeconds / 60 / 60 / 24 / 30) % 12;
      const years = Math.floor(deltaSeconds / 60 / 60 / 24 / 30 / 12);

      const intl = new Intl.DurationFormat(locale, { style: "long" });

      if (years > 0) return intl.format({ years, months });
      else if (months > 0) return intl.format({ months, days });
      else if (days > 7) return intl.format({ days });
      else if (days > 0) return intl.format({ days, hours });
      else if (hours > 0) return intl.format({ hours, minutes });
      else return intl.format({ minutes });
    });

  return { getTimeLeftValue };
};
