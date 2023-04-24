package database.tables;

import com.google.gson.Gson;
import java.sql.SQLException;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Administrator;

/**
 *
 * @author eirin
 */
public class EditAdministratorTable {

    public void createAdministratorTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE administrators"
                + "(adminID INTEGER not NULL AUTO_INCREMENT, "
                + "    firstName VARCHAR(30) not null,"
                + "    lastName VARCHAR(30) not null,"
                + "    email VARCHAR(40) not null unique,"
                + "    corp_email VARCHAR(40) not null unique,"
                + "    phone VARCHAR(40) not null unique,"
                + "    password VARCHAR(32) not null,"
                + "    depID INTEGER not NULL,"
                + " PRIMARY KEY (adminID),"
                + " FOREIGN KEY (depID) REFERENCES departments(depID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewAdministrator(String firstName, String lastName, String email, String corp_email, String phone, String password, int depID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " administrators (firstName,lastName,email,corp_email,phone,password,depID)"
                    + " VALUES ("
                    + "'" + firstName + "',"
                    + "'" + lastName + "',"
                    + "'" + email + "',"
                    + "'" + corp_email + "',"
                    + "'" + phone + "',"
                    + "'" + password + "',"
                    + "'" + depID + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The administrator was successfully added in the database.");

            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditAdministratorTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public Administrator databaseToAdministrator(String corp_email, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM administrators WHERE corp_email = '" + corp_email + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Administrator admin = gson.fromJson(json, Administrator.class);
            return admin;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }
    
    public Administrator databaseToAdministratorCorpEmail(String corp_email) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM administrators WHERE corp_email = '" + corp_email + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Administrator admin = gson.fromJson(json, Administrator.class);
            return admin;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }
}
