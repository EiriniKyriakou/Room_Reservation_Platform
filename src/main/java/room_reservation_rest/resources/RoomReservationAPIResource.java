package room_reservation_rest.resources;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.init.InitDatabase;
import database.tables.EditAdministratorTable;
import database.tables.EditEmployeeTable;
import database.tables.EditReservationTable;
import database.tables.EditRoomTable;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.Administrator;
import mainClasses.Employee;
import mainClasses.Reservation;
import mainClasses.Room;

/**
 * REST Web Service
 *
 * @author man
 */
@Path("api")
public class RoomReservationAPIResource {

    @POST
    @Path("/database")
    @Produces({MediaType.APPLICATION_JSON})
    public Response createDB() {
        InitDatabase init = new InitDatabase();
        try {
            init.initDatabase();
            Response.Status status = Response.Status.CREATED;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Database succesfully created.\"}").build();
        } catch (SQLException ex) {
            Response.Status status = Response.Status.CONFLICT;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Database already exists.\"}").build();
        } catch (ClassNotFoundException ex) {
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Fail.\"}").build();
        }
    }

    @DELETE
    @Path("/database")
    @Produces(MediaType.APPLICATION_JSON)
    public Response dropDB() {
        InitDatabase init = new InitDatabase();
        try {
            init.dropDatabase();
            Response.Status status = Response.Status.OK;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Database succesfully dropped.\"}").build();
        } catch (SQLException ex) {
            Response.Status status = Response.Status.CONFLICT;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Database doesn't exist.\"}").build();
        } catch (ClassNotFoundException ex) {
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"msg\":\"Fail.\"}").build();
        }
    }

    @POST
    @Path("/login")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response login(String user) {
        Gson gson = new Gson();
        Employee e = gson.fromJson(user, Employee.class);
        Administrator a = gson.fromJson(user, Administrator.class);

        EditEmployeeTable eet = new EditEmployeeTable();
        EditAdministratorTable eat = new EditAdministratorTable();
        try {
            Employee e_result = eet.databaseToEmployee(e.getCorp_email(), e.getPassword());
            Administrator a_result = eat.databaseToAdministrator(a.getCorp_email(), a.getPassword());

            if ((e_result != null)) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(e_result)).build();
            } else if (a_result != null) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(a_result)).build();
            } else {
                e_result = eet.databaseToEmployeeCorpEmail(e.getCorp_email());
                a_result = eat.databaseToAdministratorCorpEmail(a.getCorp_email());
                Response.Status status = Response.Status.UNAUTHORIZED;
                if (a_result != null) {
                    return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Wrong Credantials.\"}").build();
                } else if (e_result != null) {
                    if (e_result.isActive() == 0) {
                        return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Your account is locked.\"}").build();
                    }
                    return Response.status(status).type("application/json").entity("{\"type\":\"employee\",\"msg\":\"Wrong Credantials.\"}").build();
                } else {
                    return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No user with those credentials in DataBase.\"}").build();
                }
            }
        } catch (SQLException | ClassNotFoundException ex) {
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @PUT
    @Path("/lock_account")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response lock_account(String user) {
        Gson gson = new Gson();
        Employee e = gson.fromJson(user, Employee.class);
        Administrator a = gson.fromJson(user, Administrator.class);

        EditEmployeeTable eet = new EditEmployeeTable();
        EditAdministratorTable eat = new EditAdministratorTable();
        try {
            eet.updateEmployee(e.getCorp_email(), "active", "0");
            Employee e_result = eet.databaseToEmployeeCorpEmail(e.getCorp_email());

            if ((e_result != null)) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(e_result)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No user with those credentials in DataBase.\"}").build();

            }
        } catch (SQLException | ClassNotFoundException ex) {
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @GET
    @Path("/top_capacity")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response top_capacity() {
        try {
            EditRoomTable edt = new EditRoomTable();
            ArrayList<Room> rooms = new ArrayList<Room>();
            rooms = edt.getTopCapacityRooms();

            if (rooms.size() != 0) {
                Gson gson = new Gson();
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(rooms)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No rooms.\"}").build();

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class.getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @GET
    @Path("/pending_requests")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response pending_requests() {
        try {
            assert (false);
            EditReservationTable edt = new EditReservationTable();
            ArrayList<Reservation> pendReqs = new ArrayList<Reservation>();
            pendReqs = edt.getPendingRequests();
            Gson gson = new Gson();
            System.out.println(gson.toJson(pendReqs));
            if (pendReqs.size() != 0) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(pendReqs)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No pending reservations.\"}").build();
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class.getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @POST
    @Path("/employee_search")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response employee_search(String search_options) throws NullPointerException {
//        System.out.println(search_options);
        try {
            EditRoomTable ert = new EditRoomTable();
            ArrayList<String> search_results = new ArrayList<String>();
            ArrayList<Room> room_results = new ArrayList<Room>();
            Gson gson = new Gson();
            JsonObject jobj = new Gson().fromJson(search_options, JsonObject.class);
//      Add all info for the query
            search_results.add(jobj.get("roomName").toString().substring(1, jobj.get("roomName").toString().length() - 1));
            search_results.add(jobj.get("roomType").toString().substring(1, jobj.get("roomType").toString().length() - 1));
            search_results.add(jobj.get("capacity").toString().substring(1, jobj.get("capacity").toString().length() - 1));
            search_results.add(jobj.get("date").toString().substring(1, jobj.get("date").toString().length() - 1));
            search_results.add(jobj.get("start_time").toString().substring(1, jobj.get("start_time").toString().length() - 1));

            room_results = ert.getEmployeeSearchResults(search_results);
            if (room_results == null) {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No available rooms.\"}").build();
            } else if (room_results.isEmpty()) {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No available rooms.\"}").build();
            } else {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(search_options)).build();
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class.getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @GET
    @Path("/all_active_reservations")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response all_active_reservations() {
        try {
            EditReservationTable edt = new EditReservationTable();
            ArrayList<Reservation> active_reservations = new ArrayList<Reservation>();
            active_reservations = edt.getAllActiveReservations();
            Gson gson = new Gson();

            if (!active_reservations.isEmpty() || active_reservations != null) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(active_reservations)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No active reservations.\"}").build();

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class
                    .getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @POST
    @Path("/employee_active_reservations")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response employee_active_reservations(String employee_id
    ) {
        try {
            EditReservationTable edt = new EditReservationTable();
            ArrayList<Reservation> active_reservations = new ArrayList<Reservation>();
            Gson gson = new Gson();
            JsonObject jobj = new Gson().fromJson(employee_id, JsonObject.class
            );
            active_reservations = edt.getEmployeeActiveReservations(jobj.get("employeeID").toString());
            if (active_reservations != null || !active_reservations.isEmpty()) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(active_reservations)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No active reservations.\"}").build();

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class
                    .getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @GET
    @Path("/all_past_reservations")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response all_past_reservations() {
        try {
            EditReservationTable edt = new EditReservationTable();
            ArrayList<Reservation> past_reservations = new ArrayList<Reservation>();
            past_reservations = edt.getAllPastReservations();
            Gson gson = new Gson();

            if (!past_reservations.isEmpty() || past_reservations != null) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(past_reservations)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No active reservations.\"}").build();

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class
                    .getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @POST
    @Path("/employee_past_reservations")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response employee_past_reservations(String employee_id
    ) {
        try {
            EditReservationTable edt = new EditReservationTable();
            ArrayList<Reservation> past_reservations = new ArrayList<Reservation>();
            Gson gson = new Gson();
            JsonObject jobj = new Gson().fromJson(employee_id, JsonObject.class
            );
            past_reservations = edt.getEmployeePastReservations(jobj.get("employeeID").toString());
            if (past_reservations != null || !past_reservations.isEmpty()) {
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity(gson.toJson(past_reservations)).build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"No active reservations.\"}").build();

            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class
                    .getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Fail.\"}").build();
        }
    }

    @POST
    @Path("/make_reservation")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response make_reservation(String reservation
    ) {
        try {
            Gson gson = new Gson();
            Reservation r = gson.fromJson(reservation, Reservation.class
            );
            EditReservationTable edt = new EditReservationTable();
//            check the availability (not correct)
            ArrayList<Reservation> res = edt.chechAvailability(r.getReservationDate(), r.getStart_time(), r.getEnd_time(), r.getRoomID());
            System.out.println(gson.toJson(res));

            if (res == null || res.isEmpty()) {
//            make the reservation
                edt.addNewReservation(r.getReservationDate(), r.getStart_time(), r.getEnd_time(), r.getRoomID(), r.getEmployeeID(), 0, 0);
                Response.Status status = Response.Status.OK;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Request was send, wait for admin to verify\"}").build();
            } else {
                Response.Status status = Response.Status.UNAUTHORIZED;
                return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Dateand time not available.\"}").build();

            }

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RoomReservationAPIResource.class
                    .getName()).log(Level.SEVERE, null, ex);
            Response.Status status = Response.Status.INTERNAL_SERVER_ERROR;
            return Response.status(status).type("application/json").entity("{\"type\":\"\",\"msg\":\"Failed to make reservation\"}").build();
        }
    }

}
