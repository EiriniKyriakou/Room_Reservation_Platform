function creat_database() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const obj = JSON.parse(xhr.responseText);
        document.getElementById("info_span").innerHTML = obj["msg"];
        document.getElementById("notification").style.display = "block";
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
        document.getElementById("info_span").innerHTML = obj["msg"];
        document.getElementById("notification").style.display = "block";
    };

    xhr.open("DELETE", "http://localhost:8080/room_reservation/api/database");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function hide_notification() {
    document.getElementById("notification").style.display = "none";
}

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
        if (xhr.readyState === 4 && xhr.status === 200)
            
        document.getElementById("info_span").innerHTML = obj["msg"];
    };

    xhr.open("POST", "http://localhost:8080/room_reservation/api/login");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);

    //clear the values
    document.getElementById("login_email").value = "";
    document.getElementById("login_pass").value = "";

}