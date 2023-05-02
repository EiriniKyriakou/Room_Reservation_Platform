package mainClasses;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    void setReservationID(int value) {
        this.reservationID = value;
    }

    public int isAccepted() {
        return this.accepted;
    }

    void setAccepted(int value) {
        this.accepted = value;
    }

    public Date getReservationDate() {
        Date reservationDate = java.sql.Date.valueOf(this.reservationDate);
        return reservationDate;
    }

    void setReservationDate(String value) {
        this.reservationDate = value;
    }

    public String getStart_time() {
        return this.start_time;
    }

    void setStart_time(String value) {
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

    void setRoomID(int value) {
        this.roomID = value;
    }

    public int getEmployeeID() {
        return this.employeeID;
    }

    void setEmployeeID(int value) {
        this.employeeID = value;
    }

    public int isTmp() {
        return this.tmp;
    }

    void setTmp(int value) {
        this.tmp = value;
    }

    public Reservation make_reservation(String date, String start_time, String end_time) {
        return null;
    }

    public boolean update_reservation(int reservationID) {
        return false;
    }

    public boolean cancel_reservation(int reservationID) {
        return false;
    }

}
