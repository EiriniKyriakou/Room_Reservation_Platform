package mainClasses;

import java.util.List;

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

    String getPhone() {
        return this.phone;
    }

    void setPhone(String value) {
        this.phone = value;
    }

    public int getEmployeeID() {
        return this.employeeID;
    }

    void setEmployeeID(int value) {
        this.employeeID = value;
    }
    
    int getDepID() {
        return this.depID;
    }

    void setDepID(int value) {
        this.depID = value;
    }

    public String getCorp_email() {
        return this.corp_email;
    }

    void setEmail(String value) {
        this.corp_email = value;
    }

    public int isActive() {
        return this.active;
    }

    void setActive(int value) {
        this.active = value;
    }

    public String getPassword() {
        return this.password;
    }

    void setPassword(String value) {
        this.password = value;
    }

    public List<Reservation> reservations(int personID) {
        return null;
    }

    public Employee login(String email, String password) {
        return null;
    }

    public void logout(boolean p1) {
    }

}
