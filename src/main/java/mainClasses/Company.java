package mainClasses;

public class Company {

    private int compID;
    private String name, location;

    public Company(String location, String name) {
        this.location = location;
        this.name = name;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String value) {
        this.location = value;
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
    
}
