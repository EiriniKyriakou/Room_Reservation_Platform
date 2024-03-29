package database.tables;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Employee;

/**
 *
 * @author eirin
 */
public class EditEmployeeTable {
    // We create the employee table for the database 

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
                + "    depID INTEGER not NULL,"
                + " PRIMARY KEY (employeeID),"
                + " FOREIGN KEY (depID) REFERENCES departments(depID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    // We add an employee to the database
    public void addNewEmployee(String firstName, String lastName, String email, String corp_email, String phone, String password, int active, int depID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " employees (firstName,lastName,email,corp_email,phone,password,active,depID)"
                    + " VALUES ("
                    + "'" + firstName + "',"
                    + "'" + lastName + "',"
                    + "'" + email + "',"
                    + "'" + corp_email + "',"
                    + "'" + phone + "',"
                    + "'" + password + "',"
                    + "'" + active + "',"
                    + "'" + depID + "'"
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

    // Given a corporate email and a password we get the employee entry they correspond to 
    public Employee databaseToEmployee(String corp_email, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM employees WHERE corp_email = '" + corp_email + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Employee empl = gson.fromJson(json, Employee.class);
            return empl;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }

    // Given a corporate email we get the employee entry it corresponds to 
    public Employee databaseToEmployeeCorpEmail(String corp_email) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM employees WHERE corp_email = '" + corp_email + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Employee empl = gson.fromJson(json, Employee.class);
            return empl;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }
    
    // We get all active employees from the database
    public ArrayList<Employee> getAllActiveEmployees() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Employee> active_employees = new ArrayList<Employee>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM employees WHERE active='1'");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Employee empl = gson.fromJson(json, Employee.class);
                active_employees.add(empl);
            }
            System.out.println(rs + " Number of active empoyees " + active_employees.size());
            return active_employees;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }
    
    //Given attributes to change, we update the employee entry in the databse
    public void updateEmployee(String corp_email, String key, String value) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE employees SET " + key + "='" + value + "' WHERE corp_email = '" + corp_email + "'";
        stmt.executeUpdate(update);
        stmt.close();
        con.close();
    }
    // Given an employee id we get the employee entry from the database
    public Employee databaseToEmployeeID(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM employees WHERE employeeID = " + id);
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Employee empl = gson.fromJson(json, Employee.class);
            return empl;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }
}
