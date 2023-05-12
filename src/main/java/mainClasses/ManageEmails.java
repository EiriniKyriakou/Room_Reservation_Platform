package mainClasses;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

public class ManageEmails {

    public static void notifyEmployees(String reason, int reservationID, ArrayList<Employee> Employees) throws IOException {
        ProcessBuilder builder;
        
        for (Employee e : Employees) {
            //TODO: Fix Absolute Path to Relative Path
//            String path = ManageEmails.class.getResource(ManageEmails.class.getSimpleName() + ".class").getPath();
//            path = path.replaceAll("%20", " "); // replace URL-encoded spaces with regular spaces
//            path = path.substring(0, path.indexOf("target") - 1) + "/src"; // replace "target" with "src"
//            path += "/main/java/send-mail-python/mail.py";
//            path = path.substring(1);
//            System.out.println(path);
             builder = new ProcessBuilder("python", "C:\\Users\\kelet\\Documents\\GitHub\\Room_Reservation_Platform\\src\\main\\java\\send-mail-python\\mail.py", e.getCorp_email(), reason, String.valueOf(reservationID));
            builder.start();
            System.out.println("Email sent succesfully");
        }
    }
}
