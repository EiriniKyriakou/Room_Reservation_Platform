package mainClasses;

import java.util.List;

public class Room {

    private int roomID, depID;
    private String roomName, roomType;
    private int capacity;

    public Room(String roomName, String roomType, int capacity) {
        this.roomName = roomName;
        this.roomType = roomType;
    }

    int getRoomID() {
        return this.roomID;
    }

    void setRoomID(int value) {
        this.roomID = value;
    }
    
    int getDepID() {
        return this.depID;
    }

    void setDepID(int value) {
        this.depID = value;
    }

    String getRoomName() {
        return this.roomName;
    }

    void setRoomName(String value) {
        this.roomName = value;
    }

    String getRoomType() {
        return this.roomType;
    }

    void setRoomType(String value) {
        this.roomType = value;
    }

    int getCapacity() {
        return this.capacity;
    }

    void setCapacity(int value) {
        this.capacity = value;
    }

    public boolean see_availability(int roomID, String date) {
        return false;
    }

    public Room search_room(int roomID) {
        return null;
    }

    public List<Room> search_available_rooms(String date) {
        return null;
    }

}
