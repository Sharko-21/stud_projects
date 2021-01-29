$(document).on("click", ".modal_login_admin", function () {
    let email = $("#email").val();
    let password = $("#password").val();
    if (email === "" || password === "") {
        alert("Заполните данные!");
        return;
    }

    $.post({
        url: "/login",
        contentType: "application/json",
        data: JSON.stringify({
            email,
            password
        }),
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                location.reload();
            } else {
                alert("Укажите правильные данные!");
            }
        },
    });
});

$(document).on("click", ".logout", function () {
    $.get({
        url: "/logout",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                location.reload();
            } else {
                alert("Что-то пошло не так!");
            }
        },
    });
});