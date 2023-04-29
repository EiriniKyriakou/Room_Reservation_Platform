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
//        InitDatabase init = new InitDatabase();
//        init.initDatabase();
    }

    public void initDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE DATABASE HY351_Room_Reservations");
        stmt.close();
        conn.close();
        initTables();
    }

    public void dropDatabase() throws SQLException, ClassNotFoundException {
        Connection conn = getInitialConnection();
        Statement stmt = conn.createStatement();
        stmt.execute("DROP DATABASE HY351_Room_Reservations");
        stmt.close();
        conn.close();
    }

    public void initTables() throws SQLException, ClassNotFoundException {   
        EditCompanyTable ect = new EditCompanyTable();
        ect.createCompanyTable();
        ect.addNewCompany("UOC", "Crete");
        
        EditDepartmentTable edt = new EditDepartmentTable();
        edt.createDepartmentTable();
        edt.addNewDepartment("CSD", "Voutes", 1);
        
        EditRoomTable erot = new EditRoomTable();
        erot.createRoomTable();
        erot.addNewRoom("Amf A", "Amphitheater", 150, 1);
        erot.addNewRoom("Amf B", "Amphitheater", 100, 1);
        erot.addNewRoom("A.111", "Meeting Room", 10, 1);
        erot.addNewRoom("A.110", "Meeting Room", 20, 1);
        
        EditAdministratorTable eat = new EditAdministratorTable();
        eat.createAdministratorTable();
        eat.addNewAdministrator("Eirini", "Kyriakou", "e@email.com", "csdXXXX@csd.uoc.gr", "69", "eirini", 1);
        
        EditEmployeeTable eet = new EditEmployeeTable();
        eet.createEmployeeTable();
        eet.addNewEmployee("Ast", "Sel", "a@email.com", "csd@email.com", "69", "eirini", 1, 1);
        
        EditReservationTable ert = new EditReservationTable();
        ert.createReservationTable();
        Date date= Date.valueOf("2025-03-31");
        ert.addNewReservation(date, "11:00", "13:00", 1, 1, 0, 1);
        ert.addNewReservation(date, "11:00", "13:00", 1, 1, 0, 0);
        ert.addNewReservation(date, "11:00", "13:00", 1, 1, 0, 0);
        ert.addNewReservation(date, "11:00", "13:00", 1, 1, 0, 0);
        
        
    }
}
