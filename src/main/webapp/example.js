const Content = {
    guest: "content_guest",
    admin_home: "content_admin_home",
    employee_home: "content_employee_home"
}

function displayContent(id) {
    for (i in Content){
        document.getElementById(Content[i]).style.display = "none";
    }
    document.getElementById(id).style.display = "";
}

window.onload = (event) => {
  displayContent(Content.guest);
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

function send_notification(text){
    document.getElementById("info_span").innerHTML = text;
    document.getElementById("notification").style.display = "block";
}

function hide_notification() {
    document.getElementById("notification").style.display = "none";
}

window.addEventListener("load", (event) => {
    document.getElementById("login_form").addEventListener("submit",
            (event) => {
        //prevent the default form submission behavior
        event.preventDefault();
        login();
    }
    );
});


function login() {
    var jsonData = JSON.stringify(
            {
                corp_email: document.getElementById("login_email").value,
                password: document.getElementById("login_pass").value
            }
    );

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const obj = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            send_notification("Welcome back " + obj["firstName"] + " " + obj["lastName"]);
            if(obj["employeeID"]!==undefined){
                displayContent(Content.employee_home)
            } else {
                displayContent(Content.admin_home)
            }
        } else {
            send_notification("Wrong Credantials");
        }
    };

    xhr.open("POST", "http://localhost:8080/room_reservation/api/login");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);

    //clear the values
    document.getElementById("login_email").value = "";
    document.getElementById("login_pass").value = "";

}