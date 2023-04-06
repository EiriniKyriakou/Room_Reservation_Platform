package database.tables;

import java.sql.SQLException;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

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
                + " PRIMARY KEY ( adminID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewAdministrator(String firstName, String lastName, String email, String corp_email, String phone, String password) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " administrators (firstName,lastName,email,corp_email,phone,password)"
                    + " VALUES ("
                    + "'" + firstName + "',"
                    + "'" + lastName + "',"
                    + "'" + email + "',"
                    + "'" + corp_email + "',"
                    + "'" + phone + "',"
                    + "'" + password + "'"
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
    
}
