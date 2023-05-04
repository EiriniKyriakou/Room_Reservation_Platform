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
    date: "",
    time: ""
};

var reservations_count = 0;

var now = new Date();
// minimum date the user can choose, in this case now and in the future
var minDate = now.toISOString().substring(0, 10);

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
            $('#main_content').html(pageTitle("Make Reservation", "employee_make_reservation", 'content_employee_home'));
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
                <input class="search_element" type="time" id="start_time" name="start_time" min="09:00" max="17:00">
                <button class="btn-dark purple-dark search_button" onclick="search()"> <img src="img/search.png" width="25" height="25"> Search</button>
            </div>`;
}


function pageTitle(title, div_id, back) {
    let html = `<div class="container-fluid">
                <div style="display: flex; gap: 20px; align-items: center;">`;
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
    html = `<div class="cards">
                <h6 style="font-weight: bolder"> ${name} </h6>
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
        html += `<button class="btn-dark purple-dark full_button" onclick="fill_reserve_form_vars('${id}', '${name}', '${type}', '${number}');displayContent('${Content.employee_make_reservation}')"> <img src="img/icon-reserve.png" width="25" height="25"> Reserve</button>`;

    }
    html += `</div>`;
    return html;
}


function cardRoomReservation(reservation, button, img_src) {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    let status = "";
    let html = `<div class="big-cards">
                <h6 style="font-weight: bolder"> Reservation ID: ${reservation.reservationID} </h6>
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
    html += `<h6 style="font-weight: 400"> ${reservation.roomID}</h6>
                        <h6 style="font-weight: 400"> ${reservation.reservationDate}</h6>
                        <h6 style="font-weight: 400"> ${reservation.start_time}</h6>
                        <h6 style="font-weight: 400"> ${reservation.end_time}</h6>`;
    if (reservation.accepted === 1){
        status = "Accepted";
    } else if (reservation.accepted === 0){
        status = "Pending";
    } if (reservation.accepted === -1){
        status = "Denied";
    }
    html +=`<h6 style="font-weight: 400"> ${status} </h6>`;
    html +=`</div> </div>`;
    
    if (button !== null) {
        if (button === "Review" && user["adminID"]!==undefined) {
            html += `<button class="btn-dark purple-dark full_button" 
                        onclick="review_reservation(${reservation.reservationID}, ${reservation.employeeID}, ${reservation.roomID}, '${reservation.reservationDate}', '${reservation.start_time}', '${reservation.end_time}', '${status}')"> 
                        <img src=${img_src} width="25" height="25"> ${button}</button>`;
        } else if (button === "Review" && user["employeeID"]!==undefined) {
            html += `<button class="btn-dark purple-dark full_button" 
                        onclick="review_reservation_employee(${reservation.reservationID}, ${reservation.employeeID}, ${reservation.roomID}, '${reservation.reservationDate}', '${reservation.start_time}', '${reservation.end_time}', '${status}')"> 
                        <img src=${img_src} width="25" height="25"> ${button}</button>`;
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
              <td><input class="search_element" type="date" id="date_${i}" min="2014-05-11" name="date"></td>
            </tr>
            <tr>
              <td style="padding-right: 25px;"><h6>Start time:</h6></td>
              <td><input class="search_element" type="time" id="start_time_${i}" name="start_time" min="09:00" max="17:00" step="3600000"></td>
            </tr>
            <tr>
              <td><h6>End time:</h6></td>
              <td><input class="search_element" type="time" id="end_time_${i}" name="end_time" min="10:00" max="18:00" step="3600000"></td>
            </tr>
        </table>`);
    const StarttimeInput = document.getElementById('start_time_' + i);
    const EndtimeInput = document.getElementById('end_time_' + i);
    StarttimeInput.addEventListener('input', (e) => {
        let hour = e.target.value.split(':')[0];
        e.target.value = `${hour}:00`;
        document.getElementById('end_time_' + i).value = `${parseInt(hour) + 1}:00`;
    });
    EndtimeInput.addEventListener('input', (e) => {
        let hour = document.getElementById('start_time_' + i).value;
        e.target.value = `${parseInt(hour) + 1}:00`;
    });
    document.getElementById('date_' + i).min = minDate;
}

function add_reservation_from() {
    reservations_count++;
    reservationForm(reservations_count);
}

function makeReservationForm(){

    html = `<div style="display:flex; flex-flow: column;"><div id="reservation">${reserveRoomCard(reserve_form.roomID, reserve_form.roomName, reserve_form.roomType, reserve_form.roomCapacity, false)}`;
    html += `<div id="reserve_from"></div> </div>`;
    html += `<div style="display: flex; gap:15px; padding: 35px; justify-content:center">
                <img src="img/button-plus-deep-purple.png" width="25" height="25" onclick="add_reservation_from()">
                <h6>add more reservations</h6>
            </div></div>
            <button class="btn-dark purple-dark back_button" style="margin: 0 auto;" onclick="multy_reservations()">Complete Reservation</button>`;

    return html;
}

function updateReservationForm(){

    html = `<div style="display:flex; flex-flow: column;"><div id="reservation">${reserveRoomCard(reserve_form.roomID, reserve_form.roomName, reserve_form.roomType, reserve_form.roomCapacity, false)}`;
    html +=   `<div id="reserve_from"> <table>
            <tr>
              <td><h6>Date:</h6></td>
              <td><input class="search_element" type="date" id="date" min="2014-05-11" name="date"></td>
            </tr>
            <tr>
              <td style="padding-right: 25px;"><h6>Start time:</h6></td>
              <td><input class="search_element" type="time" id="start_time" name="start_time" min="09:00" max="17:00" step="3600000"></td>
            </tr>
            <tr>
              <td><h6>End time:</h6></td>
              <td><input class="search_element" type="time" id="end_time" name="end_time" min="10:00" max="18:00" step="3600000"></td>
            </tr>
        </table>
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

function employeeReviewReservation(){
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
                console.log(data[i])
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
        console.log("Results: " + data)
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#employee_search').html("<div class='cards-container' id='employee_search_rooms_cards'></div>");
            for (let i = 0; i < Object.keys(data).length; i++) {
                console.log(data[i].roomName, data[i].roomType, data[i].capacity);
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
//    displayContent(Content.employee_search);

}

function make_reservation(i) {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    var jsonData = JSON.stringify(
            {
                roomID: reserve_form.roomID,
                employeeID: user["employeeID"],
                reservationDate: document.getElementById("date_" + i).value,
                start_time: document.getElementById("start_time_" + i).value,
                end_time: document.getElementById("end_time_" + i).value
            }
    );

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            send_notification(data["msg"]);
        } else {
            send_notification(data["msg"]);
        }
    };

    xhr.open("POST", "http://localhost:8080/room_reservation/api/make_reservation");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);

}

function get_room_info(roomID){
    const xhRoom = new XMLHttpRequest();
    xhRoom.onload = function () {
        const room = JSON.parse(xhRoom.responseText);
        console.log(room);
        if (xhRoom.readyState === 4 && xhRoom.status === 200) {
            $('#name').html(room.roomName);
            $('#type').html(room.roomType);
            $('#capacity').html(room.capacity);
        } else {
            send_notification(room["msg"]);
        }
    };

    xhRoom.open("POST", "http://localhost:8080/room_reservation/api/room");
    xhRoom.setRequestHeader("Accept", "application/json");
    xhRoom.setRequestHeader("Content-Type", "application/json");
    xhRoom.send(JSON.stringify({roomID: roomID})); 
}

function review_reservation(reservationID, employeeID, roomID, reservationDate, start_time, end_time, status){
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

function update_reservation_status(reservationID, status){
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
    Swal.fire({
        title: 'Are you sure you want to delete this reservation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
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

function review_reservation_employee(reservationID, employeeID, roomID, reservationDate, start_time, end_time, status){
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

function edit_reservation(){
    var jsonData =
            {
                reservationID: document.getElementById("reservationID").innerHTML,
                reservationDate: document.getElementById("date").innerHTML,
                start_time: document.getElementById("startTime").innerHTML,
                end_time: document.getElementById("endTime").innerHTML
            };
    console.log(jsonData);
    fill_reserve_form_vars(document.getElementById("roomID").innerHTML, document.getElementById("name").innerHTML, document.getElementById("type").innerHTML, document.getElementById("capacity").innerHTML);

    //    displayContent(Content.employee_edit_reservation);
    $('#main_content').html(pageTitle("Edit Reservation "+ jsonData.reservationID, "employee_edit_reservation", 'content_employee_active_reservations'));
    $('#employee_edit_reservation').append(updateReservationForm());
    
    document.getElementById("date").value = jsonData.reservationDate;
    document.getElementById("start_time").value = jsonData.start_time;
    document.getElementById("end_time").value = jsonData.end_time;
//    $('#date').html(jsonData.reservationDate);
//    $('#start_time').html(jsonData.start_time);
//    $('#start_time').html(jsonData.end_time);
}

function update_reservation(){
    let reservationID = parseInt(document.getElementById("pageTitle").innerHTML.slice(-1));
    console.log(reservationID)
    var jsonData = JSON.stringify(
            {
                reservationID: reservationID,
                reservationDate: document.getElementById("date").value,
                start_time: document.getElementById("start_time").value,
                end_time: document.getElementById("end_time").value
            }
    );
    console.log(jsonData);
    const user = JSON.parse(localStorage.getItem("logedIn"));
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (user["employeeID"] !== undefined) {
                displayContent(Content.employee_active_reservations);
            } else if (user["adminID"] !== undefined) {
                displayContent(Content.admin_active_reservations);
            }
            send_notification(data["msg"]);
        } else {
            send_notification(data["msg"]);
        }
    };

    xhr.open("PUT", "http://localhost:8080/room_reservation/api/reservation");
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

function multy_reservations() {
    for (let i = 1; i <= reservations_count; i++) {
        make_reservation(i);
    }
}