package mainClasses;

public class Company {

    private int compID;
    private String name, location;

    public Company(String location, String name) {
        this.location = location;
        this.name = name;
    }

    String getLocation() {
        return this.location;
    }

    void setLocation(String value) {
        this.location = value;
    }

    int getCompID() {
        return this.compID;
    }

    void setCompID(int value) {
        this.compID = value;
    }

    String getName() {
        return this.name;
    }

    void setName(String value) {
        this.name = value;
    }

}
