$(document).ready(function () {
    return Promise.all([
        getCompositions(id),
        getMusicians(id),
        getPlates(id)
    ]);
});

function getMusicians(id) {
    $.get({
        url: `/ensemble/${id}/musicians`,
        success: function (data) {
            let result = JSON.parse(data);
            console.log(result);
            if (result.errNo === 0) {
                if (result.response.length === 0) {
                    $(".musicians_list").html(`<h5">Почему-то не можем найти исполнителей...</h5>`);
                    return;
                }
                $(".cards").html("");
                result.response.forEach((res, index) => {
                    $(".musicians_list").append(createMusicianItem(res, index));
                });
            }
        },
    });
}

function getCompositions(id) {
    $.get({
        url: `/ensemble/${id}/compositions`,
        success: function (data) {
            let result = JSON.parse(data);
            console.log(result);
            if (result.errNo === 0) {
                if (result.response.length === 0) {
                    $(".compositions_list").html(`<h5">Кажется у этого ансамбля пока нет композиций...</h5>`);
                    return;
                }
                $(".cards").html("");
                result.response.forEach((res, index) => {
                    $(".compositions_list").append(createSongItem(res, index));
                });
            }
        },
    });
}

function getPlates(id) {
    $.get({
        url: `/ensemble/${id}/plates`,
        success: function (data) {
            let result = JSON.parse(data);
            console.log(result);
            if (result.errNo === 0) {
                if (result.response.length === 0) {
                    $(".plates_list").html(`<h5">Кажется у этого ансамбля пока нет выпущенных пластинок...</h5>`);
                    return;
                }
                $(".cards").html("");
                result.response.forEach((res, index) => {
                    $(".plates_list").append(creatPlateItem(res, index));
                });
            }
        },
    });
}

function createSongItem(params, index) {
    return `
          <a href="/composition/${params.id}" class="list-group-item list-group-item-action">
            ${index+1}. ${params.name}
          </a>
    `;
}

function createMusicianItem(params, index) {
    return `
          <a href="/musician/${params.id}" class="list-group-item list-group-item-action">
            ${index+1}. ${params.name}
          </a>
    `;
}

function creatPlateItem(params, index) {
    return `
          <a href="/plate/${params.id}" class="list-group-item list-group-item-action">
            ${index+1}. ${params.name}
          </a>
    `;
}
