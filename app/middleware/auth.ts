export default defineNuxtRouteMiddleware(async (to, from) => {
  const authorized = await isAuthorized();

  if (!authorized.success)
    return navigateTo(getRedirectToLoginPath(authorized.reason), {
      redirectCode: 401,
    });

  return;
});
