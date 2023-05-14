package mainClasses;

import java.util.Date;

public class Reservation {

    private int reservationID;
    private String reservationDate;
    private String start_time, end_time;
    private int roomID, employeeID;
    private int tmp, accepted;

    public Reservation(String reservationDate, String start_time, String end_time, int roomID, int employeeID, int tmp, int accepted) {
        this.reservationDate = reservationDate;
        this.start_time = start_time;
        this.end_time = end_time;
        this.roomID = roomID;
        this.employeeID = employeeID;
        this.tmp = tmp;
    }

    public int getReservationID() {
        return this.reservationID;
    }

    public void setReservationID(int value) {
        this.reservationID = value;
    }

    public int isAccepted() {
        return this.accepted;
    }

    public void setAccepted(int value) {
        this.accepted = value;
    }

    public Date getReservationDate() {
        Date reservationDate = java.sql.Date.valueOf(this.reservationDate);
        return reservationDate;
    }

    public void setReservationDate(String value) {
        this.reservationDate = value;
    }

    public String getStart_time() {
        return this.start_time;
    }

    public void setStart_time(String value) {
        this.start_time = value;
    }

    public String getEnd_time() {
        return this.end_time;
    }

    void setEnd_time(String value) {
        this.end_time = value;
    }

    public int getRoomID() {
        return this.roomID;
    }

    public void setRoomID(int value) {
        this.roomID = value;
    }

    public int getEmployeeID() {
        return this.employeeID;
    }

    public void setEmployeeID(int value) {
        this.employeeID = value;
    }

    public int isTmp() {
        return this.tmp;
    }

    public void setTmp(int value) {
        this.tmp = value;
    }
}
