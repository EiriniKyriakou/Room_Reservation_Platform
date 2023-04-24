package mainClasses;

import java.util.List;

public class Administrator extends Person {

    private int adminID, depID;
    private String corp_email;
    private String phone;
    private String password;

    public Administrator(String firstName, String lastName, String email, String corp_email, String phone, String password) {
        super(firstName, lastName, email);
        this.corp_email = corp_email;
        this.password = password;
        this.phone = phone;
    }

    int getAdminID() {
        return this.adminID;
    }

    void setAdminID(int value) {
        this.adminID = value;
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

    String getPhone() {
        return this.phone;
    }

    void setPhone(String value) {
        this.phone = value;
    }

    public String getPassword() {
        return this.password;
    }

    void setPassword(String value) {
        this.password = value;
    }

    public Reservation search_reservation_request(int reservationID) {
        return null;
    }

    public boolean accept_reservation_request(int reservationID) {
        return false;
    }

    public boolean reject_reservation_request(int resrvationID) {
        return false;
    }

    public List<Reservation> see_reservations() {
        return null;
    }

    public List<Reservation> see_reservation_requests(boolean accepted) {
        return null;
    }

    public Administrator login(String email, String password) {
        return null;
    }

    public boolean logout() {
        return false;
    }

}
