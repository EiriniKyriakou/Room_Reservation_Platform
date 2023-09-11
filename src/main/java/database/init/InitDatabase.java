package database.init;

import static database.DB_Connection.getInitialConnection;
import database.tables.EditAdministratorTable;
import database.tables.EditCompanyTable;
import database.tables.EditDepartmentTable;
import database.tables.EditEmployeeTable;
import database.tables.EditReservationTable;
import database.tables.EditRoomTable;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Statement;

public class InitDatabase {

    public static void main(String[] args) throws SQLException, ClassNotFoundException {
        InitDatabase init = new InitDatabase();
        init.initDatabase();
    }

    public void initDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE DATABASE HY351_Room_Reservation");
        stmt.close();
        conn.close();
        initTables();
    }

    public void dropDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        stmt.execute("DROP DATABASE HY351_Room_Reservation");
        stmt.close();
        conn.close();
    }

    public void initTables() throws SQLException, ClassNotFoundException {      
        EditAdministratorTable eat = new EditAdministratorTable();
        eat.createAdministratorTable();
        eat.addNewAdministrator("Eirini", "Kyriakou", "e@email.com", "csdXXXX@csd.uoc.gr", "69", "eirini");
        
        EditCompanyTable ect = new EditCompanyTable();
        ect.createCompanyTable();
        ect.addNewCompany("UOC", "Crete");
        
        EditDepartmentTable edt = new EditDepartmentTable();
        edt.createDepartmentTable();
        edt.addNewDepartment("CSD", "Voutes");
        
        EditEmployeeTable eet = new EditEmployeeTable();
        eet.createEmployeeTable();
        eet.addNewEmployee("Ast", "Sel", "a@email.com", "csd@email.com", "69", "eirini", 1);
        
        EditRoomTable erot = new EditRoomTable();
        erot.createRoomTable();
        erot.addNewRoom("Amf A", "Amfitheatro", 150);
        
        EditReservationTable ert = new EditReservationTable();
        ert.createReservationTable();
        Date date= Date.valueOf("2015-03-31");
        ert.addNewReservation(date, "11:00", "13:00", 1, 1, 0, 1);
        
        
    }
}
