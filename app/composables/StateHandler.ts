export const useStateHandler = (
  fn: (...options: any) => void | Promise<void>,
) => {
  const isLoading = ref(false);

  const handle = async (...options: any) => {
    if (isLoading.value === true) return;

    isLoading.value = true;

    await fn(...options);

    isLoading.value = false;
  };

  return { isLoading, handle };
};
