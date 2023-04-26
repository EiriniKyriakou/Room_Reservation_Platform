const Content = {
    guest: "content_guest",
    admin_home: "content_admin_home",
    employee_home: "content_employee_home",
    employee_search: "content_employee_search"
};

var login_attemts = ["email", 0];

function displayContent(id) {
    for (let i in Content) {
        document.getElementById(Content[i]).style.display = "none";
    }
    document.getElementById(id).style.display = "";
    
    const user = JSON.parse(localStorage.getItem("logedIn"));
    if (id === "content_guest"){
//        Nav Bar
        let options = ["Create Database", "Drop Database"];
        let actions = ["creat_database()", "drop_database()"];
        $('#navbar-options').html(navBarOptions(options, actions, null));
    }
    else if (id === "content_employee_home") {
//        Nav Bar
        let options = ["Active Reservations", "Past Reservations"];
        let actions = ["", ""];
        $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
        
//        Top Capacity Rooms
        topCapacity();
    }
    else if (id === "content_admin_home") {
//        Nav Bar
        let options = ["Reactivate Employee", "Add Employee", "Pending Requests", "Active Reservations", "Past Reservations"];
        let actions = ["", "", "", "", ""];
        $('#navbar-options').html(navBarOptions(options, actions, user["firstName"] + " " + user["lastName"]));
    }
}

function navBarOptions(options, actions, name) {
    let html ="";
    for (let i = 0; i < Object.keys(options).length; i++){
        html += `   <li class="nav-item">
                        <a class="nav-item nav-link" onclick="${actions[i]}">${options[i]}</a>
                    </li>`;
    }
    if (name!==null){
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

function reserveRoomCard(name, type, number) {
    return        `<div class="cards">
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

window.onload = () => {
    isLoggedIn();
};

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

function send_notification(text) {
    document.getElementById("info_span").innerHTML = text;
    document.getElementById("notification").style.display = "block";
}

function hide_notification() {
    document.getElementById("notification").style.display = "none";
}

window.addEventListener("load", () => {
    document.getElementById("login_form").addEventListener("submit", (event) => {
        //prevent the default form submission behavior
        event.preventDefault();
        login();
    });
});

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

    var xhr = new XMLHttpRequest();
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
            //If password is wrong +1 on login atempts
            if (obj["msg"] === "Wrong Credantials." && obj["type"] === "employee") {
                login_attemts[1]++;
                console.log(login_attemts);
            }
        }
    };

    if (login_attemts[1] > 4) {
        xhr.open("PUT", "http://localhost:8080/room_reservation/api/lock_account");
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

function logout() {
    localStorage.setItem("logedIn", null);
    send_notification("Logout completed successfully");
    isLoggedIn();
}

function topCapacity() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        $('#top_capacity').html("");
        for (let i = 0; i < Object.keys(data).length; i++) {
            $('#top_capacity').append(reserveRoomCard(data[i].roomName, data[i].roomType, data[i].capacity));
        }
    };

    xhr.open("GET", "http://localhost:8080/room_reservation/api/top_capacity");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function search(){
    displayContent(Content.employee_search);
    $('#search_title').html("Rooms");
    $('#search_results').html("");
    $('#search_results').append(reserveRoomCard("name", "type", "number"));
    $('#search_results').append(reserveRoomCard("name", "type", "number"));
    $('#search_results').append(reserveRoomCard("name", "type", "number"));
    $('#search_results').append(reserveRoomCard("name", "type", "number"));
    $('#search_results').append(reserveRoomCard("name", "type", "number"));
}