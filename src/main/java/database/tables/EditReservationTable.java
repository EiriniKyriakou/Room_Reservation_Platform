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
}
