package mainClasses;

public class Person {

//    private int personID;
    private String firstName, lastName, email;

    public Person(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getFirstName() {
        return this.firstName;
    }

    void setFirstName(String value) {
        this.firstName = value;
    }

//    int getPersonID() {
//        return this.personID;
//    }
//
//    void setPersonID(int value) {
//        this.personID = value;
//    }

    String getLastName() {
        return this.lastName;
    }

    void setLastName(String value) {
        this.lastName = value;
    }

    String getEmail() {
        return this.email;
    }

    void setEmail(String value) {
        this.email = value;
    }

}
