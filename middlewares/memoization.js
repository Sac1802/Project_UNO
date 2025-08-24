const cacheLocal = new Map();
import setting from "../valuesMemo.json";
import Either from "../utils/Either";

const accessOrder = [];

export const memoize = (req, res, next) => {
  if (req.method !== "GET") return next();

  const key = req.method + ":" + req.originalUrl;
  if (cacheLocal.has(key)) {
    const entry = cacheLocal.get(key);
    if (entry.expire > Date.now()) {
      entry.expire = Date.now() + setting.maxAge;
      cacheLocal.set(key, entry);

      const index = accessOrder.indexOf(key);
      if (index !== -1) accessOrder.splice(index, 1);
      accessOrder.push(key);

      return res.send(Either.right(entry.data));
    } else {
      cacheLocal.delete(key);
      const index = accessOrder.indexOf(key);
      if (index !== -1) accessOrder.splice(index, 1);
    }
  }

  const originalSend = res.send.bind(res);
  res.send = (body) => {
    if (!body.isRight()) return originalSend(body);

    const dataCaches = body.right;
    cacheLocal.set(key, {
      data: dataCaches,
      expire: Date.now() + setting.maxAge,
    });

    accessOrder.push(key);

    for (const k of [...accessOrder]) {
      const v = cacheLocal.get(k);
      if (!v || v.expire < Date.now()) {
        cacheLocal.delete(k);
        accessOrder.splice(accessOrder.indexOf(k), 1);
      }
    }

    while (cacheLocal.size > setting.max) {
      const oldestKey = accessOrder.shift();
      cacheLocal.delete(oldestKey);
    }

    return originalSend(body);
  };

  next();
};
