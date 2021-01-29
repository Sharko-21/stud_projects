$(document).on("click", "#buy_plate", function (elem) {
    $.post({
        url: `/plate/${$(this).val()}/buy`,
        success: function (data) {
            let result = JSON.parse(data);
            console.log(result);
            if (result.errNo === 0) {
                alert("Куплено!")
            } else {
                alert("Что-то пошло не так!")
            }
        },
    });
});
