package room_reservation_rest;

import room_reservation_rest.resources.RoomReservationAPIResource;
import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author manos
 */
@javax.ws.rs.ApplicationPath("room_reservation")
public class RoomReservationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    @Override
    public Set<Object> getSingletons() {
        Set<Object> set = new HashSet<>();
        set.add(new RoomReservationAPIResource());
        return set;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(room_reservation_rest.resources.RoomReservationAPIResource.class);
    }
}
