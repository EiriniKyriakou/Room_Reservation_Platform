package room_reservation_rest.resources;

import com.google.gson.Gson;
import database.init.InitDatabase;
import database.tables.EditAdministratorTable;
import database.tables.EditEmployeeTable;
import java.sql.SQLException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mainClasses.Administrator;
import mainClasses.Employee;

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

}
