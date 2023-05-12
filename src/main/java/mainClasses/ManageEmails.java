package mainClasses;

import java.io.IOException;
import java.util.ArrayList;

public class ManageEmails {

    public static void notifyEmployees(String room, String prevDate, String prevTime, ArrayList<Employee> Employees) throws IOException {
        ProcessBuilder builder;
   
        for (Employee e : Employees) {
            String path = ManageEmails.class.getResource(ManageEmails.class.getSimpleName() + ".class").getPath();
            path = path.replaceAll("%20", " "); // replace URL-encoded spaces with regular spaces
            path = path.substring(0, path.indexOf("target") - 1) + "/src"; // replace "target" with "src"
            path += "/main/java/send-mail-python/mail.py";
            path = path.substring(1);
            
            builder = new ProcessBuilder("python", path.replace("/", "\\\\"), e.getCorp_email(), room, prevDate, prevTime);
            builder.start();
            System.out.println("Email sent succesfully");
        }
    }
}
