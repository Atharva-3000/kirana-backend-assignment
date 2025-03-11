import fs from 'fs';
import csv from 'csv-parser';
import { STORE_MASTER_PATH } from '../config/config.js';
import { storeCache, incrementCacheHit, incrementCacheMiss } from '../utils/cache.js';
import logger from '../utils/logger.js';

class StoreService {
  private storeMaster: Set<string> = new Set();
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.loadStores();
  }

  private loadStores(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    logger.info('Loading store master data');

    this.loadingPromise = new Promise((resolve) => {
      fs.createReadStream(STORE_MASTER_PATH)
        .pipe(csv())
        .on('data', (row: { StoreID: string }) => {
          this.storeMaster.add(row.StoreID.trim());
        })
        .on('end', () => {
          this.isLoaded = true;
          logger.info(`Store master data loaded. ${this.storeMaster.size} stores found.`);
          resolve();
        });
    });

    return this.loadingPromise;
  }

  async isStoreValid(storeId: string): Promise<boolean> {
    // Check cache first
    const cacheKey = `store_${storeId}`;
    const cachedResult = storeCache.get(cacheKey);

    if (cachedResult !== undefined) {
      incrementCacheHit();
      return cachedResult as boolean;
    }

    incrementCacheMiss();

    // If not in cache, check from store master
    if (!this.isLoaded) {
      await this.loadingPromise;
    }

    const isValid = this.storeMaster.has(storeId);

    // Cache the result
    storeCache.set(cacheKey, isValid);

    return isValid;
  }
}

export const storeService = new StoreService();