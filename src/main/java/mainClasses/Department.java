package mainClasses;

public class Department {

    private int depID, compID;
    private String name, location;

    public Department(String name, String location) {
        this.name = name;
        this.location = location;
    }

    public int getDepID() {
        return this.depID;
    }

    public void setDepID(int value) {
        this.depID = value;
    }

    public int getCompID() {
        return this.compID;
    }

    public void setCompID(int value) {
        this.compID = value;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String value) {
        this.name = value;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String value) {
        this.location = value;
    }

}
