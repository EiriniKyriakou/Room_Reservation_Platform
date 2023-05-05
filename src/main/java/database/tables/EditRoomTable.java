package database.tables;

import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Reservation;
import mainClasses.Room;

/**
 *
 * @author eirin
 */
public class EditRoomTable {

    ArrayList<Room> rooms, rooms_to_remove;

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
            rs = stmt.executeQuery("SELECT * FROM rooms WHERE roomID = " + id);
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

    public ArrayList<Room> getRoomQueryResults(ArrayList<String> search_options, ArrayList<String> keys, String query, Connection con, Statement stmt) {
        ResultSet rs;
        String room_query = "SELECT * FROM rooms WHERE ";
        try {
            for (int i = 0; i < 3; ++i) {
                if (search_options.get(i).equals("")) {
                    continue;
                }
                
                if (!search_options.get(i).equals("")) {
                    query += keys.get(i) + "='" + search_options.get(i) + "'";
                }

                // i = 2 means we are in the last concatenation before the reservation query (which we don't know if it is empty)
                if (!search_options.get(i + 1).equals("") && (i < 2)) {
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
        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, "No available rooms", ex);
        }
        return rooms;
    }

    public ArrayList<Room> getReservationQueryResults(ArrayList<String> search_options, ArrayList<String> keys, String query, Connection con, Statement stmt, int reservation_slots, int query_case) {
        String reservation_query = "SELECT * FROM reservations WHERE ";
        String rest_of_reservation_query = "";
        String room_query = "SELECT * FROM rooms WHERE ";
        String json = "";
        ResultSet rs1;
        if (query.equals("")) {
            if (search_options.get(3).equals("")) {
                try {
                    // we don't care about reservationDate
                    rooms = getTopCapacityRooms();

                } catch (ClassNotFoundException ex) {
                    Logger.getLogger(EditRoomTable.class
                            .getName()).log(Level.SEVERE, null, ex);
                }
                return rooms;
            } else if (search_options.get(4).equals("")) { // we don't care about reservationStart_time, we only care about reservationDate
                rest_of_reservation_query += "WHERE reservationDate='" + search_options.get(3) + "')";
                reservation_query = room_query + "roomID IN (" + "SELECT roomID FROM reservations ";
                query_case = 1;
            } else { // we care about both
                reservation_query = room_query + "roomID NOT IN (SELECT roomID FROM reservations WHERE reservationDate='" + search_options.get(3) + "' AND " + "start_time='" + search_options.get(4) + "' AND " + "accepted='1'" + ")";
            }

            System.out.println(reservation_query + rest_of_reservation_query);
            try {

//                System.out.println("Checking roomID " + rooms.get().getRoomID());
                System.out.println(reservation_query + rest_of_reservation_query);
                rs1 = stmt.executeQuery(reservation_query + rest_of_reservation_query); // search for rooms that have not been reserved for the date+time user has chosen

                while (rs1.next()) {
                    json = DB_Connection.getResultsToJSON(rs1);

                    Gson gson = new Gson();
                    Room room = gson.fromJson(json, Room.class
                    );
                    System.out.println("Rs1 is " + room.getRoomName());
                    rooms.add(room);
                    if (query_case == 1) {
                        reservation_slots++;
                        rooms_to_remove.add(room);
                    }

                    // so as not to show it as a result (does not match user options)
                    json = DB_Connection.getResultsToJSON(rs1);
                    System.out.println(json);

                }

                if (reservation_slots < 11 && query_case == 1) {
                    rooms = getTopCapacityRooms();
                }

                if (reservation_slots > 11) { // 12 slots per day (7am-6pm)
                    //remove it here so as not to change initial structure of arraylist
                    System.out.println(" We need to remove rooms now.");
                    for (int i = 0; i < rooms_to_remove.size(); ++i) {
                        for (int j = 0; j < rooms.size(); ++j) {
                            if (rooms.get(j).getRoomID() == rooms_to_remove.get(i).getRoomID()) {
                                System.out.println("Removing room " + rooms.get(j).getRoomName());
                                rooms.remove(j);
                            }
                        }
                    }
                    System.out.println(rooms);
                }

                System.out.println("# Employee Search Results");

                stmt.close();
                con.close();
                return rooms;

            } catch (SQLException ex) {
                System.err.println("Got an exception! ");
                Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, "No available rooms", ex);

            } catch (ClassNotFoundException ex) {
                Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, "No available rooms", ex);
            }
        }
        return rooms;
    }

    public ArrayList<Room> getRoomReservationQueryResults(ArrayList<String> search_options, ArrayList<String> keys, Connection con, Statement stmt, int reservation_slots, int query_case) {
        System.out.println("In combined query case");
        String reservation_query = "SELECT * FROM reservations WHERE ";
        String rest_of_reservation_query;
        ResultSet rs1;
        String json = "";
        try {
            for (int i = 0; i < rooms.size(); ++i) {
                rest_of_reservation_query = "";
                if (search_options.get(3).equals("")) { // we don't care about reservationDate
                    rest_of_reservation_query += " start_time ΝΟΤ IN (SELECT start_time FROM reservations WHERE roomID ="
                            + rooms.get(i).getRoomID() + ")";
                } else if (search_options.get(4).equals("")) { // we don't care about reservationStart_time
                    rest_of_reservation_query += " reservationDate IN (SELECT reservationDate FROM reservations WHERE roomID=" + rooms.get(i).getRoomID() + ")";
                    query_case = 1;
                } else { // we care about both
                    rest_of_reservation_query += "(reservationDate,start_time) IN (SELECT reservationDate,start_time FROM reservations WHERE roomID=" + rooms.get(i).getRoomID() + ")";
                    query_case = 2;
                }
                System.out.println(reservation_query + rest_of_reservation_query);

                rs1 = stmt.executeQuery(reservation_query + rest_of_reservation_query); // search for rooms that have not been reserved for the date+time user has chosen

                System.out.println("Rs1 is " + rs1);

                while (rs1.next()) {
                    if (query_case == 2) {
                        reservation_slots++;
                    }
                    rooms_to_remove.add(rooms.get(i)); // so as not to show it as a result (does not match user options)
                    json = DB_Connection.getResultsToJSON(rs1);
                    System.out.println(json);
                    continue;
                }
            }

            if (query_case == 1 || query_case == 2) {
                //remove it here so as not to change initial structure of arraylist
                System.out.println(" We need to remove rooms now.");
                for (int i = 0; i < rooms_to_remove.size(); ++i) {
                    for (int j = 0; j < rooms.size(); ++j) {
                        if (rooms.get(j).getRoomID() == rooms_to_remove.get(i).getRoomID()) {
                            System.out.println("Removing room " + rooms.get(j).getRoomName());
                            rooms.remove(j);
                        }
                    }
                }
            }
            stmt.close();
            con.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditRoomTable.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
        return rooms;
    }
// Get reservations that have been accepted and their date < current_date
// For search options we have (indexes) 0: roomName, 1: roomType, 2: roomCapacity, 3: reservationDate, 4: reservationStartTime

    public ArrayList<Room> getEmployeeSearchResults(ArrayList<String> search_options) throws ClassNotFoundException {
        try {
            rooms = new ArrayList<Room>();
            rooms_to_remove = new ArrayList<Room>();
            System.out.println(search_options);
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            rooms = new ArrayList<Room>();
            //We will build the query using key-value pairs
            ArrayList<String> keys = new ArrayList<String>();
            keys.add("roomName");
            keys.add("roomType");
            keys.add("capacity");
            keys.add("reservationDate");
            keys.add("start_time");

            String query = "";
            int reservation_slots = 0, query_case = 0;

            //we start by building the room query
            //limit: keys.size() - 2(= 3) because we then have to build the reservation query
            rooms = getRoomQueryResults(search_options, keys, query, con, stmt);

            // check if we need to search further
            if (search_options.get(3).equals("") && search_options.get(4).equals("")) {
                //do nothing(room only query)
                System.out.println("# Employee Search Results");
                stmt.close();
                con.close();
                return rooms;
            }
            // only date + time data
            if (rooms.size() == 0) {
                System.out.println("Query is Empty");
                rooms = getReservationQueryResults(search_options, keys, "", con, stmt, reservation_slots, query_case);
                return rooms;
            }

//         we need to combine both room and reservation options
            rooms = getRoomReservationQueryResults(search_options, keys, con, stmt, reservation_slots, query_case);
            return rooms;
        } catch (SQLException ex) {
            System.err.println("Got an exception! ");
            Logger
                    .getLogger(EditRoomTable.class
                            .getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }
    
    public ArrayList<Room> execute_room_query(String roomName, String roomType, String capacity) {
        ArrayList<Room> roomsFromRoomQuery = new ArrayList<>();
        try {
            String room_query = "SELECT * FROM rooms WHERE ";
            if (!roomName.equals("")) {
                room_query += "roomName = '" + roomName + "' ";
            }
            if (!roomType.equals("")) {
                if (!roomName.equals("")) {
                    room_query += "AND ";
                }
                room_query += "roomType = '" + roomType + "' ";
            }
            if (!capacity.equals("")) {
                if (!roomName.equals("") || !roomType.equals("")) {
                    room_query += "AND ";
                }
                room_query += "capacity = '" + capacity + "' ";
            }
            
            System.out.println(room_query);
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();
            ResultSet rs;

            rs = stmt.executeQuery(room_query);
            System.out.println("Result from room query: ");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                System.out.println(json);
                Gson gson = new Gson();
                Room room = gson.fromJson(json, Room.class);
                roomsFromRoomQuery.add(room);
            }
            System.out.println("");

            stmt.close();
            con.close();
            return roomsFromRoomQuery;

        } catch (SQLException ex) {
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(EditRoomTable.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    public ArrayList<Room> getEmployeeSearchResults2(String roomName, String roomType, String capacity, String date, String start_time) throws ClassNotFoundException {
        ArrayList<Room> roomsFromRoomQuery = new ArrayList<>();
        ArrayList<Reservation> reservationsFromReservationQuery = new ArrayList<>();
        String[] slots = {"09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"};
            
        if (!roomName.equals("") || !roomType.equals("") || !capacity.equals("")) {
            roomsFromRoomQuery = execute_room_query( roomName,  roomType, capacity);
        }
        if (!date.equals("") || !start_time.equals("")){
            EditReservationTable edt = new EditReservationTable();
            reservationsFromReservationQuery = edt.execute_reservation_query( date,  start_time);
        }
        
        //case 0 (empty search)
        if (roomName.equals("") && roomType.equals("") && capacity.equals("") && date.equals("") && start_time.equals("")){
            ArrayList<Room> returnRooms = getTopCapacityRooms();
            return returnRooms;
        }
        //case 1 (only details about rooms)
        if ((!roomName.equals("") || !roomType.equals("") || !capacity.equals("")) && date.equals("") && start_time.equals("")){
            return roomsFromRoomQuery;
        }
        
        //case 2 (only date), case 3 (details about rooms, and date)
        else if (!date.equals("") && start_time.equals("")){
            ArrayList<Integer> notRooms = new ArrayList<>(); //cointains thee ids of the rooms that have all the slots booked for that day
            ArrayList<Integer> reservedRooms = new ArrayList<>(); //contains the id's of the rooms that have atleast on slot booked
            ArrayList<Integer> reservedRoomsDUP = new ArrayList<>(); //contains the id's of the rooms that have atleast on slot booked, with duplicate ids
            ArrayList<Room> allRooms = new ArrayList<>(); //Begining Available Rooms
            ArrayList<Room> returnRooms = new ArrayList<>(); //Rooms without the fully booked ones
            
            //Beging Rooms
            if (roomName.equals("") && roomType.equals("") && capacity.equals("")){
                allRooms = getTopCapacityRooms();
            }else {
                allRooms = roomsFromRoomQuery;
            }
            
            //Find id's of rooms that have atleast one reservation on that date
            for (int i=0; i<reservationsFromReservationQuery.size(); i++){
                if (!reservedRooms.contains(reservationsFromReservationQuery.get(i).getRoomID())){
                    reservedRooms.add(reservationsFromReservationQuery.get(i).getRoomID());
                }
                reservedRoomsDUP.add(reservationsFromReservationQuery.get(i).getRoomID());
            }
            
            //Find id's of rooms that have all the slots booked
            for (int i=0; i<reservedRooms.size(); i++){
                if(Collections.frequency(reservedRoomsDUP, reservedRooms.get(i)) >= slots.length){
                    notRooms.add(reservedRooms.get(i));
                }
            }
            
            //Put available room in returnRooms (allRooms - notRooms)
            for (int i=0; i<allRooms.size(); i++){
                if(!notRooms.contains(allRooms.get(i).getRoomID())){
                    returnRooms.add(allRooms.get(i));
                }
            }
            return returnRooms;
        }
        
        //case 4 (date and start_time)
        else if (!date.equals("") && !start_time.equals("")){
            ArrayList<Integer> reservedRooms = new ArrayList<>(); //contains the id's of the rooms that have booked that slot
            ArrayList<Room> allRooms = new ArrayList<>(); //Begining Available Rooms
            ArrayList<Room> returnRooms = new ArrayList<>(); //Available rooms without that slot booked
            
            //Beging Rooms
            if (roomName.equals("") && roomType.equals("") && capacity.equals("")){
                allRooms = getTopCapacityRooms();
            }else {
                allRooms = roomsFromRoomQuery;
            }
            
            //Find id's of rooms that have that slot booked
            for (int i=0; i<reservationsFromReservationQuery.size(); i++){
                reservedRooms.add(reservationsFromReservationQuery.get(i).getRoomID());
            }
            //Put available room in returnRooms (allRooms - reservedRooms)
            for (int i=0; i<allRooms.size(); i++){
                if(!reservedRooms.contains(allRooms.get(i).getRoomID())){
                    returnRooms.add(allRooms.get(i));
                }
            }
            return returnRooms;
        }
        
        //case 5 (start_time) (all rooms will be available in a future date in that time)
        else if (date.equals("") && !start_time.equals("")){
            ArrayList<Room> returnRooms = new ArrayList<>(); //Available rooms without that slot booked
            //Return Rooms
            if (roomName.equals("") && roomType.equals("") && capacity.equals("")){
                returnRooms = getTopCapacityRooms();
            }else {
                returnRooms = roomsFromRoomQuery;
            }
            return returnRooms;
        }
        
        return null;
        
    }

}
