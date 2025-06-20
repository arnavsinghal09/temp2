import { PrimeUserDataService } from "./user-data";
import type { PrimeUser, PrimeCampfire } from "../types/clip";

export class ClipUserDataService {
  /**
   * Get friends list for clip sharing from current Prime user data
   */
  static getClipSharingFriends(): PrimeUser[] {
    try {
      const currentUser = PrimeUserDataService.initializeFromFireStories();

      if (!currentUser || !currentUser.friends) {
        return [];
      }

      return currentUser.friends.map((friend) => ({
        id: friend.id.toString(),
        name: friend.name,
        username: `@${friend.name.toLowerCase().replace(/\s+/g, "")}`,
        avatar: friend.avatar,
        isOnline: friend.isOnline,
      }));
    } catch (error) {
      console.error("Error getting clip sharing friends:", error);
      return [];
    }
  }

  /**
   * Get campfires list for clip sharing from current Prime user data
   */
  static getClipSharingCampfires(): PrimeCampfire[] {
    try {
      const currentUser = PrimeUserDataService.initializeFromFireStories();

      if (!currentUser || !currentUser.campfires) {
        return [];
      }

      return currentUser.campfires.map((campfire) => ({
        id: campfire.id.toString(),
        name: campfire.name,
        avatar: campfire.avatar,
        members: campfire.members,
        memberCount: campfire.memberCount,
      }));
    } catch (error) {
      console.error("Error getting clip sharing campfires:", error);
      return [];
    }
  }

  /**
   * Get current user info for clip sharing
   */
  static getCurrentUserInfo(): PrimeUser | null {
    try {
      const currentUser = PrimeUserDataService.initializeFromFireStories();

      if (!currentUser) {
        return null;
      }

      return {
        id: currentUser.id.toString(),
        name: currentUser.name,
        username: `@${currentUser.name.toLowerCase().replace(/\s+/g, "")}`,
        avatar: currentUser.avatar,
        isOnline: currentUser.isOnline,
      };
    } catch (error) {
      console.error("Error getting current user info:", error);
      return null;
    }
  }
}
