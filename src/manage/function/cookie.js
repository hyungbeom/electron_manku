import nookies, {destroyCookie, parseCookies, setCookie} from "nookies";

// todo : 여기 있는것들 nookies 라이브러리로 교체요망 *******
export const setCookies = (ctx, key, value) => {
  setCookie(ctx, key, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/"
  });

};

export const removeCookie = (ctx, key) => {
  destroyCookie(ctx, key, {
    path: '/',
  });
  // cookie.destroy(ctx, key);
};

export const getCookie = (ctx, key) => {
  const cookies = parseCookies(ctx);

  return cookies[key]
};

