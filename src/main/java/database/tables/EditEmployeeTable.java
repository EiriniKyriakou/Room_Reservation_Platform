package database.tables;

import database.DB_Connection;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author eirin
 */
public class EditEmployeeTable {
    public void createEmployeeTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE employees"
                + "(employeeID INTEGER not NULL AUTO_INCREMENT, "
                + "    firstName VARCHAR(30) not null,"
                + "    lastName VARCHAR(30) not null,"
                + "    email VARCHAR(40) not null unique,"
                + "    corp_email VARCHAR(40) not null unique,"
                + "    phone VARCHAR(40) not null unique,"
                + "    password VARCHAR(32) not null,"
                + "    active BOOLEAN,"
                + " PRIMARY KEY ( employeeID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewEmployee(String firstName, String lastName, String email, String corp_email, String phone, String password, int active) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " employees (firstName,lastName,email,corp_email,phone,password,active)"
                    + " VALUES ("
                    + "'" + firstName + "',"
                    + "'" + lastName + "',"
                    + "'" + email + "',"
                    + "'" + corp_email + "',"
                    + "'" + phone + "',"
                    + "'" + password + "',"
                    + "'" + active + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The employee was successfully added in the database.");

            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditEmployeeTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
