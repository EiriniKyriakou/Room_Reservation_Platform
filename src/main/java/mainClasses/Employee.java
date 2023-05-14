package mainClasses;

public class Employee extends Person {

    private int employeeID, depID;
    private String corp_email, phone, password;
    private int active;

    public Employee(String firstName, String lastName, String email, String corp_email, String phone, String password, int active) {
        super(firstName, lastName, email);
        this.phone = phone;
        this.corp_email = corp_email;
        this.active = active;
        this.password = password;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String value) {
        this.phone = value;
    }

    public int getEmployeeID() {
        return this.employeeID;
    }

    public void setEmployeeID(int value) {
        this.employeeID = value;
    }
    
    public int getDepID() {
        return this.depID;
    }

    public void setDepID(int value) {
        this.depID = value;
    }

    public String getCorp_email() {
        return this.corp_email;
    }

    public void setEmail(String value) {
        this.corp_email = value;
    }

    public int isActive() {
        return this.active;
    }

    public void setActive(int value) {
        this.active = value;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String value) {
        this.password = value;
    }
}
