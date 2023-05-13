window.onload = () => {
    isLoggedIn();
};
//Global Variables

//This are the pages that we have in the platform
const Content = {
    guest: "content_guest",
    admin_home: "content_admin_home",
    admin_active_reservations: "content_admin_active_reservations",
    admin_review_reservation: "content_admin_review_reservation",
    admin_edit_reservation: "content_admin_edit_reservation",
    admin_past_reservations: "content_admin_past_reservations",
    employee_home: "content_employee_home",
    employee_search: "content_employee_search",
    employee_make_reservation: "content_employee_make_reservation",
    employee_active_reservations: "content_employee_active_reservations",
    employee_review_reservation: "content_employee_review_reservation",
    employee_edit_reservation: "content_employee_edit_reservation",
    employee_past_reservations: "content_employee_past_reservations"
};
var login_attemts = ["email", 0];
var reserve_form = {
    roomID: "",
    roomName: "",
    roomType: "",
    roomCapacity: "",
    reservationDate: "",
    start_time: ""
};

var reservation_tmp = false;
var reservation_tmp_id = null;
var reservations_count = 0;
var reservation_return_count = 0;
var remainingTime;

var now = new Date();
// minimum date the user can choose, in this case now and in the future
var minDate = now.toISOString().substring(0, 10);
//Company Hours: 09:00 - 18:00
var allSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
var roomID;
var readySlots = false;
//Depending on the page we want to desplay, this function chooses what to insert in the html code
//The main idea is that we have a NavBar, and the main_content div, in which we put the content
function displayContent(id) {
    $('#main_content').html("");
    const user = JSON.parse(localStorage.getItem("logedIn"));
    let options, actions;
    switch (id) {
        case Content.guest:
//        Nav Bar
            options = ["Create Database", "Drop Database"];
            actions = ["creat_database()", "drop_database()"];
            $('#navbar-options').html(navBarOptions(options, actions, null));
//        Login From
            $('#main_content').html(loginForm());
            break;
        case Content.admin_home:
            options = ["Reactivate Employee", "Add Employee", "Pending Requests", "Active Reservations", "Past Reservations"];
            actions = ["", "", "displayContent(Content.admin_home)", "displayContent(Content.admin_active_reservations)", "displayContent(Content.admin_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(pageTitle("Pending Requests", "pending_requests", null));
            pendingRequests();
            break;
        case Content.admin_active_reservations:
            options = ["Reactivate Employee", "Add Employee", "Pending Requests", "Active Reservations", "Past Reservations"];
            actions = ["", "", "displayContent(Content.admin_home)", "displayContent(Content.admin_active_reservations)", "displayContent(Content.admin_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(pageTitle("Active Reservations", "admin_active_reservations", 'content_admin_home'));
            allActiveReservations();
            break;
        case Content.admin_review_reservation:
            options = ["Reactivate Employee", "Add Employee", "Pending Requests", "Active Reservations", "Past Reservations"];
            actions = ["", "", "displayContent(Content.admin_home)", "displayContent(Content.admin_active_reservations)", "displayContent(Content.admin_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(pageTitle("Review Reservation", "admin_review_reservation", 'content_admin_home'));
            $('#admin_review_reservation').append(reviewReservationForm());
            break;
        case Content.admin_edit_reservation:
            break;
        case Content.admin_past_reservations:
            options = ["Reactivate Employee", "Add Employee", "Pending Requests", "Active Reservations", "Past Reservations"];
            actions = ["", "", "displayContent(Content.admin_home)", "displayContent(Content.admin_active_reservations)", "displayContent(Content.admin_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(pageTitle("Past Reservations", "admin_past_reservations", 'content_admin_home'));
            allPastReservations();
            break;
        case Content.employee_home:
            options = ["Active Reservations", "Past Reservations"];
            actions = ["displayContent(Content.employee_active_reservations)", "displayContent(Content.employee_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(searchBarHome());
            const StarttimeInput = document.getElementById('start_time');
            StarttimeInput.addEventListener('input', (e) => {
                let hour = e.target.value.split(':')[0];
                e.target.value = `${hour}:00`;
            });
            $('#main_content').append(pageTitle("Top Capacity Rooms", "top_capacity", null));
            topCapacity();
            break;
        case Content.employee_search:
            $('#main_content').html(searchBarHome());
            $('#main_content').html(`<div class="purple-light search_bar"> 
                <button class="back_button btn-dark purple-dark" onclick="displayContent('content_employee_home')"> <img src="img/icon-back.png" width="25" height="25"> Back</button> 
                ${searchBarForm()}
            </div>`);
            const StarttimeInput1 = document.getElementById('start_time');
            StarttimeInput1.addEventListener('input', (e) => {
                let hour = e.target.value.split(':')[0];
                e.target.value = `${hour}:00`;
            });
            $('#main_content').append(pageTitle("Rooms", "employee_search", null));
            break;
        case Content.employee_make_reservation:
            reservations_count = 0;
            reservation_return_count = 0;
            reservation_tmp = false;
            reservation_tmp_id = null;
            let html = `<div class="container-fluid">
                <div style="display: flex; gap: 20px; align-items: center;" id="titleRow">`;
            html += `<button class="back_button btn-dark purple-dark" onclick="clearInterval(remainingTime); delete_tmp_reservation(); displayContent('content_employee_home')"> <img src="img/icon-back.png" width="25" height="25"> Back</button>`;
            html += `<h5 id="pageTitle">Make Reservation</h5>
                </div>
                <div id=employee_make_reservation class="inner-container-fluid">
                </div>
            </div>`;
            $('#main_content').html(html);
            $('#employee_make_reservation').append(makeReservationForm());
            reservations_count++;
            reservationForm(reservations_count);
            break;
        case Content.employee_active_reservations:
            $('#main_content').html(pageTitle("Active Reservations", "employee_active_reservations", 'content_employee_home'));
            employeeActiveReservations();
            break;
        case Content.employee_review_reservation:
            $('#main_content').html(pageTitle("Review Reservation", "employee_review_reservation", 'content_employee_home'));
            $('#employee_review_reservation').append(employeeReviewReservation());
            break;
        case Content.employee_edit_reservation:

            break;
        case Content.employee_past_reservations:
            $('#main_content').html(pageTitle("Past Reservations", "employee_past_reservations", 'content_employee_home'));
            employeePastReservations();
            break;
    }


}

//HTML Components
function navBarOptions(options, actions, name) {
    let html = "";
    for (let i = 0; i < Object.keys(options).length; i++) {
        html += `   <li class="nav-item">
                        <a class="nav-item nav-link" onclick="${actions[i]}">${options[i]}</a>
                    </li>`;
    }
    if (name !== null) {
        html += `   <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            ${name}
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                            <a class="dropdown-item" onclick="">My Account</a>
                            <a class="dropdown-item" onclick="logout()">Logout</a>
                        </div>
                    </li>`;
    }
    return html;
}

function loginForm() {
    return `<div class="container-fluid">
                <div class="box">
                    <div id="login_form">
                        <h5 style="text-align: center; font-weight: bolder !important">Login</h5>
                        <label for="login_email">Corporate Email</label>
                        <input type="text" id="login_email" name="login_email" value=""><br>
                        <label for="login_pass">Password</label>
                        <input type="password" id="login_pass" name="login_pass" value=""><br><br>
                        <button class="btn btn-dark purple-dark" onclick="login();">Login</button>
                    </div>
                </div>
            </div>`;
}

function searchBarHome() {
    return  `<div id="search_home" class="box">
                <div>
                    <h5 style="text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); padding-bottom: 10px">Search Rooms</h5>
                    ${searchBarForm()}
                    </div>
                </div>
            </div>`;
}

function searchBarForm() {
    return  `<div class="search_bar_form" >
                <input style="border-top-left-radius: 5px; border-bottom-left-radius: 5px;" class="search_element" type="text" id="room_name" name="room_name" placeholder="Room Name" value="">
                <select class="search_element" name="room_type" id="room_type">
                    <option value="" disabled selected hidden style="background-image: url('room_type.png')"> Type of Room</option>
                    <option value="Amphitheater">Amphitheater</option>
                    <option value="Meeting Room">Meeting Room</option>
                </select>
                <select class="search_element" name="room_capacity" id="room_capacity">
                    <option value="" disabled selected hidden>Capacity</option>s
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                </select>
                <input class="search_element" type="date" id="date" name="date">
                <select class="search_element" name="start_time" id="start_time">
                    <option value="" disabled selected hidden>Start time</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                </select>
                <button class="btn-dark purple-dark search_button" onclick="search()"> <img src="img/search.png" width="25" height="25"> Search</button>
            </div>`;
}

function pageTitle(title, div_id, back) {
    let html = `<div class="container-fluid">
                <div style="display: flex; gap: 20px; align-items: center;" id="titleRow">`;
    if (back !== null) {
        html += `<button class="back_button btn-dark purple-dark" onclick="displayContent('${back}')"> <img src="img/icon-back.png" width="25" height="25"> Back</button>`;
    }
    html += `<h5 id="pageTitle">${title}</h5>
                </div>
                <div id=${div_id} class="inner-container-fluid">
                </div>
            </div>`;
    return html;
}

function reserveRoomCard(id, name, type, number, button) {
    roomID = id;
    html = `<div class="cards">
                <h6 style="font-weight: bolder" id="roomName"> ${name} </h6>
                <div class="inner-card"> 
                    <div>
                        <h6>Type:</h6>
                        <h6>Capacity:</h6>
                    </div>
                    <div>
                        <h6 style="font-weight: 400">${type}</h6>
                        <h6 style="font-weight: 400">${number}</h6>
                    </div>
                </div>`;
    if (button === true) {
        html += `<button class="btn-dark purple-dark full_button" onclick="fill_reserve_form_vars('${id}', '${name}', '${type}', '${number}'); fill_reserve_form_vars_time(); displayContent('${Content.employee_make_reservation}')"> <img src="img/icon-reserve.png" width="25" height="25"> Reserve</button>`;
    }
    html += `</div>`;
    return html;
}

function cardRoomReservation(reservation, button, img_src) {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    let status = "";
    let html = `<div class="big-cards">
                    <div style="display: flex; gap: 5px;">
                        <h6 style="font-weight: bolder"> Reservation ID: </h6>
                        <h6 style="font-weight: bolder" id="reservationID"> ${reservation.reservationID} </h6>
                    </div>
                <div class="inner-card"> 
                    <div>`;
    if (user["employeeID"] === undefined) {
        html += `<h6>Employee ID:</h6>`;
    }
    html += `<h6>Room ID:</h6>
                        <h6>Date</h6>
                        <h6>Start Time</h6>
                        <h6>End Time</h6>
                        <h6>Status</h6>
                    </div>
                    <div>`;
    if (user["employeeID"] === undefined) {
        html += `<h6 style="font-weight: 400"> ${reservation.employeeID}</h6>`;
    }
    html += `<h6 style="font-weight: 400" id="roomID"> ${reservation.roomID}</h6>
                        <h6 style="font-weight: 400" id="date"> ${reservation.reservationDate}</h6>
                        <h6 style="font-weight: 400" id="startTime"> ${reservation.start_time}</h6>
                        <h6 style="font-weight: 400" id="endTime"> ${reservation.end_time}</h6>`;
    if (reservation.accepted === 1) {
        status = "Accepted";
    } else if (reservation.accepted === 0) {
        status = "Pending";
    }
    if (reservation.accepted === -1) {
        status = "Denied";
    }
    html += `<h6 style="font-weight: 400"> ${status} </h6>`;
    html += `</div> </div>`;
    if (button !== null) {
        if (button === "Review" && user["adminID"] !== undefined) {
            html += `<button class="btn-dark purple-dark full_button" 
                        onclick="review_reservation(${reservation.reservationID}, ${reservation.employeeID}, ${reservation.roomID}, '${reservation.reservationDate}', '${reservation.start_time}', '${reservation.end_time}', '${status}')"> 
                        <img src=${img_src} width="25" height="25"> ${button}</button>`;
        } else if (button === "Review" && user["employeeID"] !== undefined) {
            html += `<button class="btn-dark purple-dark full_button" 
                        onclick="review_reservation_employee(${reservation.reservationID}, ${reservation.employeeID}, ${reservation.roomID}, '${reservation.reservationDate}', '${reservation.start_time}', '${reservation.end_time}', '${status}')"> 
                        <img src=${img_src} width="25" height="25"> ${button}</button>`;
        } else if (button === "Edit" && user["adminID"] !== undefined) {
            html += `<button class="btn-dark purple-dark full_button" onclick="edit_reservation()"> <img src=${img_src} width="25" height="25"> ${button}</button>`;
        } else {
            html += `<button class="btn-dark purple-dark full_button"> <img src=${img_src} width="25" height="25"> ${button}</button>`;
        }
    }
    html += `</div>`;
    return html;
}

function reservationForm(i) {
    $('#reserve_from').append(`<table>
            <tr>
              <td><h6>Date:</h6></td>
              <td><input class="search_element" type="date" id="date_${i}" min="2014-05-11" name="date" onchange="available_slots(${i})"></td>
            </tr>
            <tr>
              <td style="padding-right: 25px;"><h6>Start time:</h6></td>
              <td>
                <select id="start_time_${i}" class="search_element" name="start_time" style="width:102px;" onchange="end_time_slots(${i})">
                </select>
            </td>
            </tr>
            <tr>
              <td><h6>End time:</h6></td>
              <td><div class="search_element" id="end_time_${i}" style="width:102px; display: table-cell; vertical-align: middle; padding-left:25px;"></div></td>
            </tr>
        </table>`);
    const StarttimeInput = document.getElementById('start_time_' + i);
    const EndtimeInput = document.getElementById('end_time_' + i);
    document.getElementById('date_' + i).min = minDate;
    if (i === 1 && reserve_form.reservationDate !== "") {
        document.getElementById('date_1').value = reserve_form.reservationDate;
        available_slots(1);
    }
    if (i === 1 && reserve_form.start_time !== "") {
        checkSlots();
    }


}

function checkSlots() {
    if (readySlots === false) {
        window.setTimeout(checkSlots, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        console.log("reserve_form.start_time =" + reserve_form.start_time)
        document.getElementById('start_time_1').value = reserve_form.start_time;
        document.getElementById('end_time_1').innerHTML = allSlots[allSlots.indexOf(reserve_form.start_time) + 1];
        readySlots = false;
        if (reserve_form.reservationDate !== "") {
            console.log(document.getElementById('start_time_1').value)
            checkStartTime();

        }
    }
}

function checkStartTime() {
    if (document.getElementById('start_time_1').value === "") {
        window.setTimeout(checkStartTime, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        reservation_tmp = true;
        make_reservation(1);
    }
}

function end_time_slots(i) {
    let hour = document.getElementById('start_time_' + i).value;
    document.getElementById('end_time_' + i).innerHTML = allSlots[allSlots.indexOf(hour) + 1];
}

function add_reservation_from() {
    reservations_count++;
    reservationForm(reservations_count);
}

function makeReservationForm() {

    html = `<div style="display:flex; flex-flow: column;"><div id="reservation">${reserveRoomCard(reserve_form.roomID, reserve_form.roomName, reserve_form.roomType, reserve_form.roomCapacity, false)}`;
    html += `<div id="reserve_from"></div> </div>`;
    html += `<div style="display: flex; gap:15px; padding: 35px; justify-content:center">
                <img src="img/button-plus-deep-purple.png" width="25" height="25" onclick="add_reservation_from()">
                <h6>add more reservations</h6>
            </div></div>
            <button class="btn-dark purple-dark back_button" style="margin: 0 auto;" onclick="multy_reservations()">Complete Reservation</button>`;
    return html;
}

function updateReservationForm() {

    html = `<div style="display:flex; flex-flow: column;"><div id="reservation">${reserveRoomCard(reserve_form.roomID, reserve_form.roomName, reserve_form.roomType, reserve_form.roomCapacity, false)}`;
    html += `<div id="reserve_from"> 

</div></div>`;
    html += `<br>
            <button class="btn-dark purple-dark back_button" style="margin: 0 auto;" onclick="update_reservation()">Update Reservation</button>`;
    return html;
}

function reviewReservationForm() {
    return `
    <div class="box" style="flex-flow: column;" id="reservationReview">
        <div class="max-cards">
            <h6 style="font-weight: bolder"> Reservation Info </h6>
                <div class="inner-card"> 
                    <table>
                        <tr>
                          <td><h6>Reservation ID:</h6></td>
                          <td><p id="reservationID"></p></td>
                        </tr>
                        <tr>
                          <td><h6>Employee ID:</h6></td>
                          <td><p id="employeeID"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">First Name:</h6></td>
                          <td><p id="firstName"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Last Name:</h6></td>
                          <td><p id="lastName"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Email:</h6></td>
                          <td><p id="email"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL paddingR">Corporate Email:</h6></td>
                          <td><p id="corpEmail"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Phone:</h6></td>
                          <td><p id="phone"></p></td>
                        </tr>
                        <tr>
                          <td><h6>Room ID:</h6></td>
                          <td><p id="roomID"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Name:</h6></td>
                          <td><p id="name"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Type:</h6></td>
                          <td><p id="type"></p></td>
                        </tr>
                        <tr>
                          <td><h6 class="paddingL">Capacity:</h6></td>
                          <td><p id="capacity"></p></td>
                        </tr>
                        <tr>
                          <td><h6>Date:</h6></td>
                          <td><p id="date"></p></td>
                        </tr>
                        <tr>
                          <td><h6>Start time:</h6></td>
                          <td><p id="startTime"></p></td>
                        </tr>
                        <tr>
                          <td><h6>End time:</h6></td>
                          <td><p id="endTime"></p></td>
                        </tr>
                        <tr>
                          <td><h6>Status:</h6></td>
                          <td><p id="status"></p></td>
                        </tr>
                    </table>
                </div>
        </div>
    
    </div>`;
}

function employeeReviewReservation() {
    return `
    <div class="box" style="flex-flow: column;" >
        <div class="big-cards" id="reservationReview">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <h6 style="font-weight: bolder"> Reservation Info </h6>
                <button class="back_button btn-dark purple-dark" onclick="edit_reservation()"> <img src="img/icon-edit.png" width="25" height="25"> Edit</button>
            </div>
            <div class="inner-card"> 
                <table>
                    <tr>
                      <td><h6 class="paddingR">Reservation ID:</h6></td>
                      <td><p id="reservationID"></p></td>
                    </tr>
                    <tr>
                    <tr>
                      <td><h6>Room ID:</h6></td>
                      <td><p id="roomID"></p></td>
                    </tr>
                    <tr>
                      <td><h6 class="paddingL">Name:</h6></td>
                      <td><p id="name"></p></td>
                    </tr>
                    <tr>
                      <td><h6 class="paddingL">Type:</h6></td>
                      <td><p id="type"></p></td>
                    </tr>
                    <tr>
                      <td><h6 class="paddingL">Capacity:</h6></td>
                      <td><p id="capacity"></p></td>
                    </tr>
                    <tr>
                      <td><h6>Date:</h6></td>
                      <td><p id="date"></p></td>
                    </tr>
                    <tr>
                      <td><h6>Start time:</h6></td>
                      <td><p id="startTime"></p></td>
                    </tr>
                    <tr>
                      <td><h6>End time:</h6></td>
                      <td><p id="endTime"></p></td>
                    </tr>
                    <tr>
                      <td><h6>Status:</h6></td>
                      <td><p id="status"></p></td>
                    </tr>
                </table>
            </div>
            
        </div>
    
    </div>`;
}

//Requests
function creat_database() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const obj = JSON.parse(xhr.responseText);
        send_notification(obj["msg"]);
    };
    xhr.open("POST", "http://localhost:8080/room_reservation/api/database");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function drop_database() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const obj = JSON.parse(xhr.responseText);
        send_notification(obj["msg"]);
    };
    xhr.open("DELETE", "http://localhost:8080/room_reservation/api/database");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function login() {
    var jsonData = JSON.stringify(
            {
                corp_email: document.getElementById("login_email").value,
                password: document.getElementById("login_pass").value
            }
    );
    //if first attempt to login with this email 
    if (document.getElementById("login_email").value !== login_attemts[0]) {
        login_attemts[0] = document.getElementById("login_email").value;
        login_attemts[1] = 0;
    }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const obj = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (obj["adminID"] !== undefined) {
                localStorage.setItem("logedIn", xhr.responseText);
                login_attemts = ["email", 0];
                send_notification("Welcome back " + obj["firstName"] + " " + obj["lastName"]);
                displayContent(Content.admin_home);
                document.getElementById("navbarDropdownMenuLink").innerHTML = obj["firstName"] + " " + obj["lastName"];
            } else if (obj["employeeID"] !== undefined && obj["active"] === 1) {
                localStorage.setItem("logedIn", xhr.responseText);
                login_attemts = ["email", 0];
                send_notification("Welcome back " + obj["firstName"] + " " + obj["lastName"]);
                displayContent(Content.employee_home);
                document.getElementById("navbarDropdownMenuLink").innerHTML = obj["firstName"] + " " + obj["lastName"];
            } else {
                send_notification("Your account is locked");
            }
        } else {
            send_notification(obj["msg"]);
            //If password is wrong, +1 on login atempts
            if (obj["msg"] === "Wrong Credantials." && obj["type"] === "employee") {
                login_attemts[1]++;
            }
        }
    };
    //If 5 wrong attempts lock account
    if (login_attemts[1] > 4) {
        xhr.open("PUT", "http://localhost:8080/room_reservation/api/lock_account");
        //Login request
    } else {
        xhr.open("POST", "http://localhost:8080/room_reservation/api/login");
    }
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
    //clear the values
    document.getElementById("login_email").value = "";
    document.getElementById("login_pass").value = "";
}

function topCapacity() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#top_capacity').html("<div class='cards-container' id='top_capacity_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#top_capacity_cards').append(reserveRoomCard(data[i].roomID, data[i].roomName, data[i].roomType, data[i].capacity, true));
            }
        } else {
            $('#top_capacity').html(data["msg"]);
        }
    };
    xhr.open("GET", "http://localhost:8080/room_reservation/api/top_capacity");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function pendingRequests() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#pending_requests').html("<div class='cards-container' id='pending_requests_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#pending_requests_cards').append(cardRoomReservation(data[i], "Review", "img/icon-review.png"));
            }
        } else {
            $('#pending_requests').html(data["msg"]);
        }
    };
    xhr.open("GET", "http://localhost:8080/room_reservation/api/pending_requests");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function employeeActiveReservations() {
    const xhr = new XMLHttpRequest();
    const user = JSON.parse(localStorage.getItem("logedIn"));
    var jsonData = JSON.stringify(
            {
                employeeID: user["employeeID"]
            }
    );
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#employee_active_reservations').html("<div class='cards-container' id='employee_active_reservations_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_active_reservations_cards').append(cardRoomReservation(data[i], "Review", "img/icon-review.png"));
            }
        } else {
            $('#employee_active_reservations').html(data["msg"]);
        }
    };
    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_active_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

function employeePastReservations() {
    const xhr = new XMLHttpRequest();
    const user = JSON.parse(localStorage.getItem("logedIn"));
    var jsonData = JSON.stringify(
            {
                employeeID: user["employeeID"]
            }
    );
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#employee_past_reservations').html("<div class='cards-container' id='employee_past_reservations_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_past_reservations_cards').append(cardRoomReservation(data[i], null, null));
            }
        } else {
            $('#employee_past_reservations').html(data["msg"]);
        }
    };
    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_past_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

function allActiveReservations() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#admin_active_reservations').html("<div class='cards-container' id='admin_active_reservations_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#admin_active_reservations_cards').append(cardRoomReservation(data[i], "Edit", "img/icon-edit.png"));
            }
        } else {
            $('#admin_active_reservations').html(data["msg"]);
        }
    };
    xhr.open("GET", "http://localhost:8080/room_reservation/api/all_active_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function allPastReservations() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#admin_past_reservations').html("<div class='cards-container' id='admin_past_reservations_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#admin_past_reservations_cards').append(cardRoomReservation(data[i], null, null));
            }
        } else {
            $('#admin_past_reservations').html(data["msg"]);
        }
    };
    xhr.open("GET", "http://localhost:8080/room_reservation/api/all_past_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function search() {
    var jsonData = {
        roomName: document.getElementById("room_name").value,
        roomType: document.getElementById("room_type").value,
        capacity: document.getElementById("room_capacity").value,
        date: document.getElementById("date").value,
        start_time: document.getElementById("start_time").value
    };
    displayContent(Content.employee_search);
    document.getElementById("room_name").value = jsonData.roomName;
    document.getElementById("room_type").value = jsonData.roomType;
    document.getElementById("room_capacity").value = jsonData.capacity;
    document.getElementById("date").value = jsonData.date;
    document.getElementById("start_time").value = jsonData.start_time;
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        console.log("Results: " + JSON.stringify(data));
        if (xhr.readyState === 4 && xhr.status === 200) {
            jsonData = JSON.parse(jsonData);
            if (jsonData.date === '' && jsonData.start_time === '') {
                document.getElementById("pageTitle").innerHTML = "Rooms:";
            } else {
                document.getElementById("pageTitle").innerHTML = "Available rooms:";
            }
            $('#employee_search').html("<div class='cards-container' id='employee_search_rooms_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_search_rooms_cards').append(reserveRoomCard(data[i].roomID, data[i].roomName, data[i].roomType, data[i].capacity, true));
            }
        } else {
            $('#employee_search').html(data["msg"]);
        }
    };
    jsonData = JSON.stringify(jsonData);
    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_search");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

function make_reservation(i) {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    var jsonData;
    if (reservation_tmp === true && i === 1 && reservation_tmp_id === null) {
        jsonData = JSON.stringify(
                {
                    roomID: reserve_form.roomID,
                    employeeID: user["employeeID"],
                    reservationDate: document.getElementById("date_" + i).value,
                    start_time: document.getElementById("start_time_" + i).value,
                    end_time: document.getElementById("end_time_" + i).innerHTML,
                    tmp: 1
                }
        );

    } else if (reservation_tmp === true && i === 1 && reservation_tmp_id !== null) {
        jsonData = JSON.stringify(
                {
                    reservationID: reservation_tmp_id,
                    roomID: reserve_form.roomID,
                    employeeID: user["employeeID"],
                    reservationDate: document.getElementById("date_" + i).value,
                    start_time: document.getElementById("start_time_" + i).value,
                    end_time: document.getElementById("end_time_" + i).innerHTML,
                    tmp: 0
                }
        );
    } else {
        jsonData = JSON.stringify(
                {
                    roomID: reserve_form.roomID,
                    employeeID: user["employeeID"],
                    reservationDate: document.getElementById("date_" + i).value,
                    start_time: document.getElementById("start_time_" + i).value,
                    end_time: document.getElementById("end_time_" + i).innerHTML,
                    tmp: 0
                }
        );
    }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            reservation_return_count++;
            if (i === 1 && reservation_tmp === true && reservation_tmp_id === null && data["id"] !== "null") {
                reservation_return_count--;
                reservation_tmp_id = data["id"];
                console.log(reservation_tmp_id);
//                remainingTime = setTimeout(delete_tmp_reservation, 300000 /*milliseconds in 5 minutes*/);
                startTimer(5);
            } else if (reservation_return_count === reservations_count) {
                send_notification("Request was sent, wait for admin to verify");
                displayContent(Content.employee_home);
            }
        } else {
            send_notification(data["msg"]);
        }
    };

    if (i === 1 && reservation_tmp === true && reservation_tmp_id !== null) {
        clearTimeout(remainingTime);
        console.log("update tmp reservation");
        console.log(jsonData);
        xhr.open("PUT", "http://localhost:8080/room_reservation/api/reservation");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(jsonData);
    } else {
        console.log("make reservation");
        xhr.open("POST", "http://localhost:8080/room_reservation/api/make_reservation");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(jsonData);
    }

}

function delete_tmp_reservation() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("tmp reservation was deleted");
            displayContent(Content.employee_home);
        } else {
            console.log("tmp reservation was not deleted");
        }
    };

    xhr.open("DELETE", "http://localhost:8080/room_reservation/api/reservation");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({reservationID: parseInt(reservation_tmp_id)}));
}

function get_room_info(roomID) {
    const xhRoom = new XMLHttpRequest();
    xhRoom.onload = function () {
        const room = JSON.parse(xhRoom.responseText);
        if (xhRoom.readyState === 4 && xhRoom.status === 200) {
            $('#name').html(room.roomName);
            $('#type').html(room.roomType);
            $('#capacity').html(room.capacity);
            fill_reserve_form_vars(room.roomID, room.roomName, room.roomType, room.capacity);
        } else {
            send_notification(room["msg"]);
        }
    };
    xhRoom.open("POST", "http://localhost:8080/room_reservation/api/room");
    xhRoom.setRequestHeader("Accept", "application/json");
    xhRoom.setRequestHeader("Content-Type", "application/json");
    xhRoom.send(JSON.stringify({roomID: roomID}));
}

function review_reservation(reservationID, employeeID, roomID, reservationDate, start_time, end_time, status) {
    displayContent(Content.admin_review_reservation);
    $('#reservationID').html(reservationID);
    $('#employeeID').html(employeeID);
    $('#roomID').html(roomID);
    $('#date').html(reservationDate);
    $('#startTime').html(start_time);
    $('#endTime').html(end_time);
    $('#status').html(status);
    $('#reservationReview').append(`
        <div style="display: flex; justify-content:space-between; width: 500px; padding: 35px 0px;">
            <button class="btn-dark purple-dark back_button" style="padding: 5px 70px;" onclick="update_reservation_status(${reservationID},1)"> <img src="img/icon-accept.png" width="25" height="25"> Accept</button>
            <button class="btn-dark purple-dark back_button" style="padding: 5px 70px;" onclick="update_reservation_status(${reservationID},-1)"> <img src="img/icon-reject.png" width="25" height="25"> Reject</button>
        </div>`);
    const xhrEmployee = new XMLHttpRequest();
    xhrEmployee.onload = function () {
        const employee = JSON.parse(xhrEmployee.responseText);
        if (xhrEmployee.readyState === 4 && xhrEmployee.status === 200) {
            $('#firstName').html(employee.firstName);
            $('#lastName').html(employee.lastName);
            $('#email').html(employee.email);
            $('#corpEmail').html(employee.corp_email);
            $('#phone').html(employee.phone);
        } else {
            send_notification(employee["msg"]);
        }
    };
    xhrEmployee.open("POST", "http://localhost:8080/room_reservation/api/employee");
    xhrEmployee.setRequestHeader("Accept", "application/json");
    xhrEmployee.setRequestHeader("Content-Type", "application/json");
    xhrEmployee.send(JSON.stringify({employeeID: employeeID}));
    get_room_info(roomID);
}

function update_reservation_status(reservationID, status) {
    var jsonData = JSON.stringify(
            {
                reservationID: reservationID,
                accepted: status
            }
    );
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            displayContent(Content.admin_home);
            send_notification(data["msg"]);
        } else {
            send_notification(data["msg"]);
        }
    };
    xhr.open("PUT", "http://localhost:8080/room_reservation/api/reservation_status");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

function cancel_reservation(reservationID) {
//Pop up for if you want to cancel the reservation
    Swal.fire({
        title: 'Are you sure you want to delete this reservation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
//if you say yes to the pop up you have to re enter yur password
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Confirm Password',
                html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                focusConfirm: false,
                preConfirm: () => {
                    const password = Swal.getPopup().querySelector('#password').value;
                    const user = JSON.parse(localStorage.getItem("logedIn"));
                    if (user["password"] !== password) {
                        Swal.showValidationMessage(`Wrong password`);
                    }
                    if (!password) {
                        Swal.showValidationMessage(`Please enter password`);
                    }
                    return {password: password};
                }
            }).then((result) => {
                const user = JSON.parse(localStorage.getItem("logedIn"));
                if (user["password"] === result.value.password) {
//if your password was correct you can undo the cancelation within 30secs
                    document.getElementById("reservationReview").style.display = "none";
                    let timerInterval;
                    Swal.fire({
                        timer: 30000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'UNDO',
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            document.getElementById("reservationReview").style.display = "flex";
                        } else {
                            const xhr = new XMLHttpRequest();
                            xhr.onload = function () {
                                const data = JSON.parse(xhr.responseText);
                                if (xhr.readyState === 4 && xhr.status === 200) {
                                    displayContent(Content.employee_active_reservations);
                                    send_notification(data["msg"]);
                                    Swal.fire(
                                            'Deleted!',
                                            'Your reservation has been deleted.',
                                            'success'
                                            );
                                } else {
                                    send_notification(data["msg"]);
                                }
                            };
                            xhr.open("DELETE", "http://localhost:8080/room_reservation/api/reservation");
                            xhr.setRequestHeader("Accept", "application/json");
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.send(JSON.stringify({reservationID: reservationID}));
                        }
                    });
                }
            });
        }
    });

}

function review_reservation_employee(reservationID, employeeID, roomID, reservationDate, start_time, end_time, status) {
    displayContent(Content.employee_review_reservation);
    $('#reservationID').html(reservationID);
    $('#employeeID').html(employeeID);
    $('#roomID').html(roomID);
    $('#date').html(reservationDate);
    $('#startTime').html(start_time);
    $('#endTime').html(end_time);
    $('#status').html(status);
    $('#reservationReview').append(`<button class="btn-dark purple-dark full_button" onclick="cancel_reservation(${reservationID})"> <img src="img/icon-cancel.png" width="25" height="25"> Cancel Reservation</button>`);
    get_room_info(roomID);
}

function edit_reservation() {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    if (user["adminID"] !== undefined) {
        var jsonData =
                {
                    reservationID: parseInt(document.getElementById("reservationID").innerHTML),
                    reservationDate: document.getElementById("date").innerHTML.slice(1),
                    start_time: document.getElementById("startTime").innerHTML.slice(1),
                    end_time: document.getElementById("endTime").innerHTML.slice(1)
                };
        console.log("Old reservation: " + JSON.stringify(jsonData));
        get_room_info(parseInt((document.getElementById("roomID").innerHTML)));
        $('#main_content').html(pageTitle("Edit Reservation " + jsonData.reservationID, "admin_edit_reservation", 'content_admin_active_reservations'));
        setTimeout(() => {
            $('#admin_edit_reservation').append(updateReservationForm());
            reservationForm(1);
            document.getElementById("date_1").value = jsonData.reservationDate;
//            document.getElementById("start_time_1").value = jsonData.start_time;
            available_slots_update_reservation(jsonData.reservationDate, reserve_form.roomID, jsonData.start_time);
            document.getElementById("end_time_1").innerHTML = jsonData.end_time;
        }, 100);
    } else {
        var jsonData =
                {
                    reservationID: document.getElementById("reservationID").innerHTML,
                    reservationDate: document.getElementById("date").innerHTML,
                    start_time: document.getElementById("startTime").innerHTML,
                    end_time: document.getElementById("endTime").innerHTML
                };
        console.log("Old reservation: " + JSON.stringify(jsonData));
        fill_reserve_form_vars(document.getElementById("roomID").innerHTML, document.getElementById("name").innerHTML, document.getElementById("type").innerHTML, document.getElementById("capacity").innerHTML);
        $('#main_content').html(pageTitle("Edit Reservation " + jsonData.reservationID, "employee_edit_reservation", 'content_employee_active_reservations'));
        $('#employee_edit_reservation').append(updateReservationForm());
        reservationForm(1);
        document.getElementById("date_1").value = jsonData.reservationDate;
//        document.getElementById("start_time_1").value = jsonData.start_time;
        available_slots_update_reservation(jsonData.reservationDate, reserve_form.roomID, jsonData.start_time);
        document.getElementById("end_time_1").innerHTML = jsonData.end_time;
    }
}

function update_reservation() {
    Swal.fire({
        title: 'Confirm Password',
        html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: 'Confirm',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const password = Swal.getPopup().querySelector('#password').value;
            const user = JSON.parse(localStorage.getItem("logedIn"));
            if (user["password"] !== password) {
                Swal.showValidationMessage(`Wrong password`);
            }
            if (!password) {
                Swal.showValidationMessage(`Please enter password`);
            }
            return {password: password};
        }
    }).then((result) => {
        const user = JSON.parse(localStorage.getItem("logedIn"));
        if (user["password"] === result.value.password) {
            let reservationID = parseInt(document.getElementById("pageTitle").innerHTML.slice(17));
            let status;
            if (user["adminID"] !== undefined) {
                status = 1;
            } else if (user["employeeID"] !== undefined)
                status = 0;
            var jsonData = JSON.stringify(
                    {
                        reservationID: reservationID,
                        reservationDate: document.getElementById("date_1").value,
                        start_time: document.getElementById("start_time_1").value,
                        end_time: document.getElementById("end_time_1").innerHTML,
                        accepted: status,
                        tmp: 0
                    }
            );
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const data = JSON.parse(xhr.responseText);
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (user["employeeID"] !== undefined) {
                        displayContent(Content.employee_active_reservations);
                        send_notification("Wait for admin to review your request.");
                    } else if (user["adminID"] !== undefined) {
                        displayContent(Content.admin_active_reservations);
                        send_notification("Reservation updated successfully.");
                        // TODO: here we should send email 
                    }

                } else {
                    send_notification(data["msg"]);
                }
            };
            console.log("Update Reservation: " + jsonData);
            xhr.open("PUT", "http://localhost:8080/room_reservation/api/reservation");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(jsonData);
        }
    });
}

function available_slots(i) {
    let date = document.getElementById("date_" + i).value;
    if (date === undefined) {
        date = document.getElementById("date_" + i).innerHTML
    }
    var jsonData = JSON.stringify(
            {
                reservationDate: date,
                roomID: roomID
            }
    );
    console.log(jsonData)
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("load slots")
            $('#start_time_' + i).html('');
            for (let j = 0; j < Object.keys(data).length; j++) {
                $('#start_time_' + i).append('<option value="' + data[j] + '">' + data[j] + '</option>');
            }
            document.getElementById('end_time_' + i).innerHTML = allSlots[allSlots.indexOf(data[0]) + 1];
            readySlots = true;
        } else {
            send_notification(data["msg"]);
        }
    };
    xhr.open("PUT", "http://localhost:8080/room_reservation/api/available_slots");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

function available_slots_update_reservation(reservationDate, roomID, start_time) {
    var jsonData = JSON.stringify(
            {
                reservationDate: reservationDate,
                roomID: roomID
            }
    );
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        $('#start_time_1').html('<option value="' + start_time + '">' + start_time + '</option>');
        if (xhr.readyState === 4 && xhr.status === 200) {
            for (let j = 0; j < Object.keys(data).length; j++) {
                $('#start_time_1').append('<option value="' + data[j] + '">' + data[j] + '</option>');
            }
        } else {
            send_notification(data["msg"]);
        }
    };
    xhr.open("PUT", "http://localhost:8080/room_reservation/api/available_slots");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
}

//Helpful Functions
function send_notification(text) {
    document.getElementById("info_span").innerHTML = text;
    document.getElementById("notification").style.display = "block";
}

function hide_notification() {
    document.getElementById("notification").style.display = "none";
}

function isLoggedIn() {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    if (user !== null) {
        if (user["employeeID"] !== undefined) {
            displayContent(Content.employee_home);
        } else if (user["adminID"] !== undefined) {
            displayContent(Content.admin_home);
        }
        send_notification("Welcome back " + user["firstName"] + " " + user["lastName"]);
        document.getElementById("navbarDropdownMenuLink").innerHTML = user["firstName"] + " " + user["lastName"];
    } else {
        displayContent(Content.guest);
    }
}

function logout() {
    localStorage.clear();
    send_notification("Logout completed successfully");
    isLoggedIn();
}

function fill_reserve_form_vars(id, name, type, number) {
    reserve_form.roomID = id;
    reserve_form.roomName = name;
    reserve_form.roomType = type;
    reserve_form.roomCapacity = number;
}

function fill_reserve_form_vars_time() {
    reserve_form.reservationDate = document.getElementById("date").value;
    reserve_form.start_time = document.getElementById("start_time").value;
}

function multy_reservations() {
    for (let i = 1; i <= reservations_count; i++) {
        make_reservation(i);
    }
}

function startTimer(minute) {

    $('#titleRow').append(
            `<div style="margin-left: auto;"> <h6 id="timer">Time left: 05:00</h6></div>`
            )
    let seconds = minute * 60;
    let textSec = '0';
    let statSec = 60;
    const prefix = minute < 10 ? '0' : '';
    remainingTime = setInterval(() => {
        seconds--;
        if (statSec != 0)
            statSec--;
        else
            statSec = 59;

        if (statSec < 10) {
            textSec = '0' + statSec;
        } else
            textSec = statSec;
        let time = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
        console.log(time)
        document.getElementById("timer").innerHTML = "Time left: " + time;

        if (seconds == 0) {
            console.log('End of timer');
            clearInterval(remainingTime);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your time has expired'
            });
            delete_tmp_reservation();
        }
    }, 1000);
}