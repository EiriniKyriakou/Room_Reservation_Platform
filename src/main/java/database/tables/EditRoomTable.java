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
import mainClasses.Room;

/**
 *
 * @author eirin
 */
public class EditRoomTable {

    public void createRoomTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE rooms"
                + "(roomID INTEGER not NULL AUTO_INCREMENT, "
                + "    roomName VARCHAR(30) not null unique,"
                + "    roomType VARCHAR(30) not null,"
                + "    capacity INTEGER not null,"
                + "    depID INTEGER not NULL,"
                + " PRIMARY KEY (roomID),"
                + " FOREIGN KEY (depID) REFERENCES departments(depID))";

        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewRoom(String roomName, String roomType, int capacity, int depID) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " rooms (roomName,roomType,capacity,depID)"
                    + " VALUES ("
                    + "'" + roomName + "',"
                    + "'" + roomType + "',"
                    + "'" + capacity + "',"
                    + "'" + depID + "'"
                    + ")";
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The room was successfully added in the database.");

            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public ArrayList<Room> getTopCapacityRooms() throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;
            ArrayList<Room> rooms = new ArrayList<Room>();

            rs = stmt.executeQuery("SELECT * FROM rooms ORDER BY capacity DESC");
            System.out.println(rs);
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Room room = gson.fromJson(json, Room.class);
                rooms.add(room);
            }
            System.out.println("# Top Capacity");

            stmt.close();
            con.close();
            return rooms;

        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    public Room databaseToRoomID(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM rooms WHERE roomID = " + id );
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Room r = gson.fromJson(json, Room.class);
            return r;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        stmt.close();
        con.close();
        return null;
    }

    // Get reservations that have been accepted and their date < current_date
    // For search options we have (indexes) 0: roomName, 1: roomType, 2: roomCapacity, 3: reservationDate, 4: reservationStartTime
    public ArrayList<Room> getEmployeeSearchResults(ArrayList<String> search_options) throws ClassNotFoundException {
        try {
            System.out.println(search_options);
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs, rs1;
            ArrayList<Room> rooms = new ArrayList<Room>();
            // We will build the query using key-value pair style
            ArrayList<String> keys = new ArrayList<String>();
            keys.add("roomName");
            keys.add("roomType");
            keys.add("capacity");
            keys.add("reservationDate");
            keys.add("start_time");

            String reservation_query = "SELECT * FROM reservations WHERE ";
            String room_query = "SELECT * FROM rooms WHERE ";

            String query = "";
            //we start by building the room query
            //limit: keys.size() - 2(= 3) because we then have to build the reservation query
            for (int i = 0; i < 3; ++i) {
                if (!search_options.get(i).equals("")) {
                    query += keys.get(i) + "='" + search_options.get(i) + "'";
                }

                if (!search_options.get(i).equals("") && !search_options.get(i + 1).equals("") && (i < 2)) { // i = 2 means we are in the last concatenation before the reservation query (which we don't know if it is empty)
                    query += " AND ";
                }
            }
            String json = "";
            if (!query.equals("")) {
                System.out.println(room_query + query);
                rs = stmt.executeQuery(room_query + query);
                System.out.println("Result set is " + rs);
                while (rs.next()) {
                    json = DB_Connection.getResultsToJSON(rs);
                    System.out.println(json);
                    Gson gson = new Gson();
                    Room room = gson.fromJson(json, Room.class);
                    rooms.add(room);
                }
            }

            if (search_options.get(3).equals("") && search_options.get(4).equals("")) {
                //do nothing(room only query)
                System.out.println("# Employee Search Results");
                stmt.close();
                con.close();
                return rooms;
            }

            String rest_of_reservation_query = "";
            int reservation_slots = 0, query_date_case = 0;
            ArrayList<Room> rooms_to_remove = new ArrayList<Room>();
            //only date + time data
            if (query.equals("")) {
                if (search_options.get(3).equals("")) { // we don't care about reservationDate 
                    rooms = getTopCapacityRooms();
                    return rooms;
                } else if (search_options.get(4).equals("")) { // we don't care about reservationStart_time, we only care about reservationDate
                    rest_of_reservation_query += "WHERE reservationDate='" + search_options.get(3) + "')";
                    reservation_query = room_query + "roomID IN (" + "SELECT roomID FROM reservations ";
                    query_date_case = 1;
                } else { // we care about both
                    reservation_query = room_query + " roomID NOT IN (SELECT roomID FROM reservations WHERE reservationDate='" + search_options.get(3) + "' AND " + "start_time='" + search_options.get(4) + "' )";
                }
                System.out.println(reservation_query + rest_of_reservation_query);

                rs1 = stmt.executeQuery(reservation_query + rest_of_reservation_query); // search for rooms that have not been reserved for the date+time user has chosen
                System.out.println("Rs1 is " + rs1);

                while (rs1.next()) {
                    json = DB_Connection.getResultsToJSON(rs1);
                    Gson gson = new Gson();
                    Room room = gson.fromJson(json, Room.class);

                    if (query_date_case == 1) {
                        reservation_slots++;
                        rooms_to_remove.add(room);
                    }

                    rooms.add(room); // so as not to show it as a result (does not match user options)
                    json = DB_Connection.getResultsToJSON(rs1);
                    System.out.println(json);
                    continue;
                }

                if (reservation_slots == 0) {
                    rooms = getTopCapacityRooms();
                }
                if (reservation_slots > 12) { // 12 slots per day (7am-6pm)
                    //remove it here so as not to change initial structure of arraylist
                    for (Room r : rooms_to_remove) {
                        rooms.remove(r);
                    }
                }
                System.out.println("# Employee Search Results");
                stmt.close();
                con.close();
                return rooms;
            }

            for (int i = 0; i < rooms.size(); ++i) {
                rest_of_reservation_query = "";
                if (search_options.get(3).equals("")) { // we don't care about reservationDate
                    rest_of_reservation_query += " start_time IN (SELECT start_time FROM reservations WHERE roomID ="
                            + rooms.get(i).getRoomID() + ")";
                } else if (search_options.get(4).equals("")) { // we don't care about reservationStart_time
                    rest_of_reservation_query += " reservationDate IN (SELECT reservationDate FROM reservations WHERE roomID=" + rooms.get(i).getRoomID() + ")";
                } else { // we care about both
                    rest_of_reservation_query += " (reservationDate,start_time) IN (SELECT reservationDate,start_time FROM reservations WHERE roomID=" + rooms.get(i).getRoomID() + ")";
                    query_date_case = 1;
                }
                System.out.println(reservation_query + rest_of_reservation_query);

                rs1 = stmt.executeQuery(reservation_query + rest_of_reservation_query); // search for rooms that have not been reserved for the date+time user has chosen
                System.out.println("Rs1 is " + rs1);

                while (rs1.next()) {
                    if (query_date_case == 1) {
                        reservation_slots++;
                    }
                    rooms_to_remove.add(rooms.get(i)); // so as not to show it as a result (does not match user options)
                    json = DB_Connection.getResultsToJSON(rs1);
                    System.out.println(json);
                    continue;
                }

            }

            if (reservation_slots > 12) { // 12 slots per day (7am-6pm)
                //remove it here so as not to change initial structure of arraylist
                for (Room r : rooms_to_remove) {
                    rooms.remove(r);
                }
            }
            System.out.println("Available Rooms\n" + "# Employee Search Results");
            stmt.close();
            con.close();
            for (int i = 0; i < rooms.size(); ++i) {
                System.out.println(rooms.get(i).getRoomName());

            }
            return rooms;
        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

}
