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
            $('#main_content').html(pageTitle("Active Reservations", "admin_active_reservations"), 'content_admin_home');
            allActiveReservations();
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
            $('#main_content').append(pageTitle("Top Capacity Rooms", "top_capacity", null));
            topCapacity();
            break;
        case Content.employee_search:
            $('#main_content').html(`<div class="purple-light search_bar"> 
                <button class="back_button btn-dark purple-dark" onclick="displayContent('content_employee_home')"> <img src="img/icon-back.png" width="25" height="25"> Back</button> 
                ${searchBarForm()}
            </div>`);
//        Search Results  
            $('#main_content').append(`<div class="search_container">
                <h5 id="search_title"> </h5>
                <div class="inner-container-fluid" id='search_results'>                 
                </div>
            </div>`);
            break;
        case Content.employee_make_reservation:
            break;
        case Content.employee_active_reservations:
            options = ["Active Reservations", "Past Reservations"];
            actions = ["displayContent(Content.employee_active_reservations)", "displayContent(Content.employee_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
            $('#main_content').html(pageTitle("Active Reservations", "employee_active_reservations", 'content_employee_home'));
            employeeActiveReservations();
            break;
        case Content.employee_review_reservation:
            break;
        case Content.employee_edit_reservation:
            break;
        case Content.employee_past_reservations:
            options = ["Active Reservations", "Past Reservations"];
            actions = ["displayContent(Content.employee_active_reservations)", "displayContent(Content.employee_past_reservations)"];
            $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
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
                    <option value="" disabled selected hidden>Capacity</option>
                    <option value="100">100</option>
                </select>
                <input class="search_element" type="date" id="date" name="date">
                <input class="search_element" type="time" id="start_time" name="start_time">
                <button class="btn-dark purple-dark search_button" onclick="search()"> <img src="img/search.png" width="25" height="25"> Search</button>
            </div>`;
}


function pageTitle(title, div_id, back) {
    let html = `<div class="container-fluid">
                <div style="display: flex; gap: 20px; align-items: center;">`;
    if (back !== null) {
        html += `<button class="back_button btn-dark purple-dark" onclick="displayContent('${back}')"> <img src="img/icon-back.png" width="25" height="25"> Back</button>`;
    }
    html += `<h5>${title}</h5>
                </div>
                <div id=${div_id} class="inner-container-fluid">
                </div>
            </div>`;
    return html;
}


function reserveRoomCard(name, type, number) {
    return  `<div class="cards">
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
                </div>
                <button class="btn-dark purple-dark full_button"> <img src="img/icon-reserve.png" width="25" height="25"> Reserve</button>
            </div>`;
}


function cardRoomReservation(reservationID, employeeID, roomID, reservationDate, start_time, end_time, status, button, img_src) {
    const user = JSON.parse(localStorage.getItem("logedIn"));
    let html = `<div class="big-cards">
                <h6 style="font-weight: bolder"> Reservation ID: ${reservationID} </h6>
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
                    <div>`
    if (user["employeeID"] === undefined) {
        html += `<h6 style="font-weight: 400"> ${employeeID}</h6>`;
    }
    html += `<h6 style="font-weight: 400"> ${roomID}</h6>
                        <h6 style="font-weight: 400"> ${reservationDate}</h6>
                        <h6 style="font-weight: 400"> ${start_time}</h6>
                        <h6 style="font-weight: 400"> ${end_time}</h6>
                        <h6 style="font-weight: 400"> ${status}</h6>
                </div>
                </div>`
    if (button !== null) {
        html += `<button class="btn-dark purple-dark full_button"> <img src=${img_src} width="25" height="25"> ${button}</button>`
    }
    html += `</div>`;
    return html;
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
            $('#top_capacity').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#top_capacity').append(reserveRoomCard(data[i].roomName, data[i].roomType, data[i].capacity));
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
            $('#pending_requests').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#pending_requests').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Pending", "Review", "img/icon-review.png"));
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
            $('#employee_active_reservations').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_active_reservations').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Accepted", "Edit", "img/icon-edit.png"));
            }
        } else {
            $('#employee_active_reservations').html(data["msg"]);
        }
    };

    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_active_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.parse(jsonData));
    xhr.send(jsonData);
}

function employeePastReservations() {
    const xhr = new XMLHttpRequest();
    const user = JSON.parse(localStorage.getItem("logedIn"));
    var jsonData = JSON.stringify(
            {
                employeeID: "1"
            }
    );

    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#employee_past_reservations').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_past_reservations').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Accepted", "Edit", "img/icon-edit.png"));
            }
        } else {
            $('#employee_past_reservations').html(data["msg"]);
        }
    };
    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_past_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.parse(jsonData));
    xhr.send(jsonData);
}

function allActiveReservations() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#admin_active_reservations').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#admin_active_reservations').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Accepted", "Edit", "img/icon-edit.png"));
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
            $('#admin_past_reservations').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#admin_past_reservations').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Accepted", "Edit", "img/icon-edit.png"));
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
    displayContent(Content.employee_search);
    $('#search_title').html("Rooms");
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            $('#employee_search_rooms').html("");
            for (let i = 0; i < Object.keys(data).length; i++) {
                $('#employee_search_rooms').append(cardRoomReservation(data[i].reservationID, data[i].employeeID, data[i].roomID, data[i].reservationDate, data[i].start_time, data[i].end_time, "Accepted", "Reserve", "img/icon-reserve.png"));
            }
        } else {
            $('#employee_search_rooms').html(data["msg"]);
        }
    };

    xhr.open("POST", "http://localhost:8080/room_reservation/api/employee_active_reservations");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.parse(jsonData));
    xhr.send();

    $('#search_results').html("");
//    $('#search_results').append(reserveRoomCard("name", "type", "number"));
//    $('#search_results').append(reserveRoomCard("name", "type", "number"));
//    $('#search_results').append(reserveRoomCard("name", "type", "number"));
//    $('#search_results').append(reserveRoomCard("name", "type", "number"));
//    $('#search_results').append(reserveRoomCard("name", "type", "number"));
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