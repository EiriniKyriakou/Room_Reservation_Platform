package mainClasses;

public class Room {

    private int roomID, depID;
    private String roomName, roomType;
    private int capacity;

    public Room(String roomName, String roomType, int capacity) {
        this.roomName = roomName;
        this.roomType = roomType;
    }

    public int getRoomID() {
        return this.roomID;
    }

    public void setRoomID(int value) {
        this.roomID = value;
    }

    public int getDepID() {
        return this.depID;
    }

    public void setDepID(int value) {
        this.depID = value;
    }

    public String getRoomName() {
        return this.roomName;
    }

    public void setRoomName(String value) {
        this.roomName = value;
    }

    public String getRoomType() {
        return this.roomType;
    }

    public void setRoomType(String value) {
        this.roomType = value;
    }

    public int getCapacity() {
        return this.capacity;
    }

    public void setCapacity(int value) {
        this.capacity = value;
    }
}
