class RoomService {
  private activeRooms = new Map<string, Set<string>>();

  addUserToRoom(roomId: string, userId: string) {
    if (!this.activeRooms.has(roomId)) {
      this.activeRooms.set(roomId, new Set());
    }
    this.activeRooms.get(roomId)?.add(userId);
  }

  removeUserFromRoom(roomId: string, userId: string) {
    this.activeRooms.get(roomId)?.delete(userId);
    if (this.activeRooms.get(roomId)?.size === 0) {
      this.activeRooms.delete(roomId);
    }
  }

  getUserCount(roomId: string): number {
    return this.activeRooms.get(roomId)?.size || 0;
  }
}

export default new RoomService();
