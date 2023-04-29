package database.tables;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.PreparedStatement;
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
    public ArrayList<Reservation> getAllActiveReservations(Date current_date) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = '1' AND date >='" + current_date + "'");
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

    public ArrayList<Reservation> getEmployeeActiveReservations(Date current_date, int employeeID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = '1' AND date >= '" + current_date + " and employeeID = " + employeeID);
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

    public ArrayList<Reservation> getAllPastReservations(Date current_date) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 and date < " + current_date);
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
    // Get reservations for specific employee that have been accepted and their date < current_date

    public ArrayList<Reservation> getEmployeePastReservations(Date current_date, int employeeID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Reservation> reservations = new ArrayList<Reservation>();

            rs = stmt.executeQuery("SELECT * FROM reservations WHERE accepted = 1 and date < " + current_date + "and date < " + current_date);
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

}
