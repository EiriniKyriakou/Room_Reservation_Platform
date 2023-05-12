package mainClasses;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

public class ManageEmails {

    public static void notifyEmployees(String reason, int reservationID, ArrayList<Employee> Employees) throws IOException {
        ProcessBuilder builder;
        
        for (Employee e : Employees) {
            //TODO: Fix Absolute Path to Relative Path
            builder = new ProcessBuilder("python", "C:\\Users\\kelet\\Documents\\GitHub\\Room_Reservation_Platform\\src\\main\\java\\send-mail-python\\mail.py", e.getCorp_email(), reason, String.valueOf(reservationID));
            builder.start();
            System.out.println("Email sent succesfully");
        }
    }
}
