package database.tables;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Reservation;

/**
 *
 * @author eirin
 */
public class EditReservationTable {

    public void createReservationTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE reservations"
                + "(reservationID INTEGER not NULL AUTO_INCREMENT, "
                + "    reservationDate DATE not null,"
                + "    start_time VARCHAR(30) not null,"
                + "    end_time VARCHAR(30) not null,"
                + "    roomID INTEGER not null,"
                + "    employeeID INTEGER not null,"
                + "    tmp BOOLEAN not null,"
                + "    accepted BOOLEAN not null,"
                + " PRIMARY KEY (reservationID),"
                + " FOREIGN KEY (roomID) REFERENCES rooms(roomID),"
                + " FOREIGN KEY (employeeID) REFERENCES employees(employeeID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewReservation(Date reservationDate, String start_time, String end_time, int roomID, int employeeID, int tmp, int accepted) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " reservations (reservationDate,start_time,end_time,roomID,employeeID,tmp,accepted)"
                    + " VALUES ("
                    + "'" + reservationDate + "',"
                    + "'" + start_time + "',"
                    + "'" + end_time + "',"
                    + "'" + roomID + "',"
                    + "'" + employeeID + "',"
                    + "'" + tmp + "',"
                    + "'" + accepted + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The reservation was successfully added in the database.");

            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditReservationTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // Get reservations that have neither been accepted nor rejected
    public ArrayList<Reservation> getPendingRequests() throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 0");
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# Pending Requests");

            stmt.close();
            con.close();
            return reservations;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    // Get reservations that have been accepted and their date >= current_date
    public ArrayList<Reservation> getAllActiveReservations() throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();
            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 AND reservationDate >= CURDATE()");
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# All Active Reservations");
            stmt.close();
            con.close();
            return reservations;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    // Get reservations  for specific employee that have been accepted and their date >= current_date
    public ArrayList<Reservation> getEmployeeActiveReservations(String employee_id) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 AND reservationDate >= CURDATE() AND employeeID="+employee_id);
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# Employee Active Reservations");
            stmt.close();
            con.close();
            return reservations;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    // Get reservations that have been accepted and their date < current_date
    public ArrayList<Reservation> getAllPastReservations() throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 AND reservationDate < CURDATE()");
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# All Past Reservations");
            stmt.close();
            con.close();
            return reservations;
        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    // Get reservations for specific employee that have been accepted and their date < current_date // Get reservations  for specific employee that have been accepted and their date >= current_date
    public ArrayList<Reservation> getEmployeePastReservations(String employee_id) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 AND reservationDate < CURDATE() AND employeeID="+employee_id);
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# Employee Past Reservations");
            stmt.close();
            con.close();
            return reservations;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public ArrayList<Reservation> chechAvailability(Date reservationDate, String start_time, String end_time, int roomID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE roomID=" + roomID + " AND reservationDate='" + reservationDate + "' AND start_time='" + start_time + "'");
            System.out.println(rs);

            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Reservation reservation = gson.fromJson(json, Reservation.class);
                reservations.add(reservation);
            }
            System.out.println("# Ckech Availability");

            stmt.close();
            con.close();
            return reservations;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    public void updateReservation(int reservationID, String key, int value) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE reservations SET " + key + "='" + value + "' WHERE reservationID = '" + reservationID + "'";
        stmt.executeUpdate(update);
        stmt.close();
        con.close();
    }
    
    public void deleteReservation(int reservationID) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "DELETE FROM reservations WHERE reservationID = '" + reservationID + "'";
        stmt.execute(update);
        stmt.close();
        con.close();
    }
}
