package mainClasses;

public class Department {

    private int depID;
    private String name, location;

    public Department(String name, String location) {
        this.name = name;
        this.location = location;
    }

    int getDepID() {
        return this.depID;
    }

    void setDepID(int value) {
        this.depID = value;
    }

    String getName() {
        return this.name;
    }

    void setName(String value) {
        this.name = value;
    }

    String getLocation() {
        return this.location;
    }

    void setLocation(String value) {
        this.location = value;
    }

}
