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
    
    public ArrayList<Room> getTopCapacityRooms() throws ClassNotFoundException{
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
}
