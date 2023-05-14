package mainClasses;

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

    public int getAdminID() {
        return this.adminID;
    }

    public void setAdminID(int value) {
        this.adminID = value;
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

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String value) {
        this.phone = value;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String value) {
        this.password = value;
    }
}
