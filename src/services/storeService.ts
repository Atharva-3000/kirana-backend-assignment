import fs from 'fs';
import csv from 'csv-parser';
import { STORE_MASTER_PATH } from '../config/config.js';

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

    this.loadingPromise = new Promise((resolve) => {
      fs.createReadStream(STORE_MASTER_PATH)
        .pipe(csv())
        .on('data', (row: { StoreID: string }) => {
          this.storeMaster.add(row.StoreID.trim());
        })
        .on('end', () => {
          console.log('Store master data loaded');
          this.isLoaded = true;
          resolve();
        });
    });

    return this.loadingPromise;
  }

  async isStoreValid(storeId: string): Promise<boolean> {
    if (!this.isLoaded) {
      await this.loadingPromise;
    }
    return this.storeMaster.has(storeId);
  }
}

export const storeService = new StoreService();