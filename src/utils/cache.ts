import NodeCache from 'node-cache';

// Create cache instances
export const storeCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); // 1 hour TTL
export const imageCache = new NodeCache({ stdTTL: 3600 * 24, checkperiod: 600 }); // 24 hour TTL

// Cache statistics
let cacheHits = 0;
let cacheMisses = 0;

export const getCacheStats = () => {
    return {
        hits: cacheHits,
        misses: cacheMisses,
        hitRate: cacheHits + cacheMisses > 0
            ? Math.round((cacheHits / (cacheHits + cacheMisses)) * 100)
            : 0
    };
};

export const incrementCacheHit = () => {
    cacheHits++;
};

export const incrementCacheMiss = () => {
    cacheMisses++;
};