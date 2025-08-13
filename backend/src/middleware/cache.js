import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); 

export const cacheMiddleware = (keyBuilder, ttl = 60) => (req, res, next) => {
  const key = keyBuilder(req);
  const hit = cache.get(key);
  if (hit) return res.json(hit);
  const send = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body, ttl);
    send(body);
  };
  next();
};

export const invalidateUserCache = (userId) => {
  const keys = cache.keys();
  keys
    .filter(k => k.includes(`user:${userId}:`))
    .forEach(k => cache.del(k));
};
