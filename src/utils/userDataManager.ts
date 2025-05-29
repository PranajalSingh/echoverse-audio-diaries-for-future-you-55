
import type { Entry } from "../pages/Index";

export class UserDataManager {
  private static getUserEntriesKey(userId: string): string {
    return `echoverse_entries_${userId}`;
  }

  private static getUserLastVisitKey(userId: string): string {
    return `echoverse_last_visit_${userId}`;
  }

  static getUserEntries(userId: string): Entry[] {
    try {
      const entries = localStorage.getItem(this.getUserEntriesKey(userId));
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error loading user entries:', error);
      return [];
    }
  }

  static saveUserEntries(userId: string, entries: Entry[]): void {
    try {
      localStorage.setItem(this.getUserEntriesKey(userId), JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving user entries:', error);
    }
  }

  static getUserLastVisit(userId: string): string | null {
    return localStorage.getItem(this.getUserLastVisitKey(userId));
  }

  static saveUserLastVisit(userId: string, timestamp: string): void {
    localStorage.setItem(this.getUserLastVisitKey(userId), timestamp);
  }

  static clearUserData(userId: string): void {
    localStorage.removeItem(this.getUserEntriesKey(userId));
    localStorage.removeItem(this.getUserLastVisitKey(userId));
  }

  static getAllUserDataKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('echoverse_entries_') || key.startsWith('echoverse_last_visit_'))) {
        keys.push(key);
      }
    }
    return keys;
  }
}
