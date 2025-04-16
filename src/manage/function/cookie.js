import nookies, {destroyCookie, parseCookies, setCookie} from "nookies";

export const setCookies = (ctx, key, value) => {
  setCookie(ctx, key, value, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

};

export const removeCookie = (ctx, key) => {
  destroyCookie(ctx, key, { path: '/' }); // 반드시 path 지정!
};

export const getCookie = (ctx, key) => {
  const cookies = typeof window === "undefined"
      ? parseCookies(ctx)   // SSR
      : parseCookies();     // CSR
  return cookies[key];
};