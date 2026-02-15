export const useDarkModeStore = defineStore("darkMode", () => {
  const darkMode = ref(false);

  const handleModeChange = () => {
    const classList = document.documentElement.classList;

    if (classList.contains("dark")) darkMode.value = true;
    else darkMode.value = false;
  };

  const observer: MutationObserver = new MutationObserver(handleModeChange);
  observer.observe(document.documentElement, { attributes: true });
  handleModeChange();

  return { darkMode };
});
