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
public class EditCompanyTable {
    // We create the company table for the database 
    public void createCompanyTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE companies"
                + "(compID INTEGER not NULL AUTO_INCREMENT, "
                + "    name VARCHAR(30) not null unique,"
                + "    location VARCHAR(30) not null unique,"
                + " PRIMARY KEY ( compID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }
    
    // We add a company to the database
    public void addNewCompany(String name, String location) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " companies (name,location)"
                    + " VALUES ("
                    + "'" + name + "',"
                    + "'" + location + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The company was successfully added in the database.");

            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditCompanyTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
