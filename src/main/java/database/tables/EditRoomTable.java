package database.tables;

import database.DB_Connection;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

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
                + " PRIMARY KEY ( roomID))";
        stmt.execute(query);
        stmt.close();
        con.close();
    }

    public void addNewRoom(String roomName, String roomType, int capacity) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " rooms (roomName,roomType,capacity)"
                    + " VALUES ("
                    + "'" + roomName + "',"
                    + "'" + roomType + "',"
                    + "'" + capacity + "'"
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
}
