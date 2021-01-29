let appState = {
    modalParams: {
        elemID: 0,
        mode: "",
        type: "",
    },
    queryData: []
};

$(document).on("click", "#search", function () {
    search($('#type').val(), $('#name').val());
});

$(document).on("click", "#create_plate", function () {
    appState.modalParams.mode = "create";
    appState.modalParams.type = "plate";
    appState.modalParams.elemID = 0;
    appState.modalParams.ensembleID = null;
    initModal("plate", {
        id: 0,
        name: "",
        description: "",
        producedBy: "",
        retailPrice: 0,
        wholesalePrice: 0,
        wholesaler: "",
    })
});

$(document).on("click", "#create_ensemble", function () {
    appState.modalParams.mode = "create";
    appState.modalParams.type = "ensemble";
    appState.modalParams.elemID = 0;
    appState.modalParams.ensembleID = null;
    initModal("ensemble", {
        id: 0,
        name: "",
        description: "",
        type: "solo"
    });
});


$(document).ready(function () {
    search($('#type').val(), $('#name').val());
});

$(document).on("change", "#type",function () {
    $("#search").trigger("click");
    switch ($("#type").val()) {
        case "plate":
            $(".create_block").html(`<button class="btn btn-secondary my-2 my-sm-0" id="create_plate" data-toggle="modal" data-target="#myModal">Добавить</button>`);
            break;
        case "ensemble":
            $(".create_block").html(`<button class="btn btn-secondary my-2 my-sm-0" id="create_ensemble" data-toggle="modal" data-target="#myModal">Добавить</button>`);
            break;
        case "musician":
            $(".create_block").html(``);
            break;
        case "composition":
            $(".create_block").html(``);
            break;
    }
});

$(document).on("click", ".modal_save", function () {
    console.log(appState);
    switch (appState.modalParams.type) {
        case "plate":
            savePlate();
            break;
        case "ensemble":
            saveEnsemble();
            break;
    }
});

function savePlate() {
    let name = $("#plateName").val();
    let description = $("#description").val();
    let producer = $("#producer").val();
    let retailPrice = +$("#retailPrice").val();
    let wholesalePrice = +$("#wholesalePrice").val();
    let wholesaler = $("#wholesaler").val();
    if (name === "") {
        alert("Укажите имя!");
        return;
    }
    if (description === "") {
        alert("Укажите описание!");
        return;
    }
    if (producer === "") {
        alert("Укажите производителя пластинки!");
        return;
    }
    if (retailPrice < 1) {
        alert("Укажите правильную розничную стоимость!");
        return;
    }
    if (wholesalePrice < 1) {
        alert("Укажите правильную оптовую стоимость!");
        return;
    }
    if (wholesaler === "") {
        alert("Укажите адрес оптового продавца");
        return;
    }
    $.post({
            url: "/plate",
            contentType: "application/json",
            data: JSON.stringify({
                id: appState.modalParams.elemID,
                name,
                description,
                producer,
                retailPrice,
                wholesalePrice,
                wholesaler
            }),
            success: function (data) {
                let result = JSON.parse(data);
                if (result.errNo === 0) {
                    $("#close_modal").trigger("click");
                    search($('#type').val(), $('#name').val());
                }
            },
        });
}

function saveEnsemble() {
    let name = $("#ensembleName").val();
    let description = $("#description").val();
    let type = $("#ensemble_type").val();
    if (name === "") {
        alert("Укажите имя!");
        return;
    }
    if (description === "") {
        alert("Укажите описание!");
        return;
    }
    $.post({
        url: "/ensemble",
        contentType: "application/json",
        data: JSON.stringify({
            id: appState.modalParams.elemID,
            name,
            description,
            type
        }),
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                $("#close_modal").trigger("click");
                search($('#type').val(), $('#name').val());
            }
        },
    });
}

$(document).on("click", "#change", function () {
    let type = appState.queryData[0].queryType;
    let elemID = +$(this).val();
    appState.modalParams.mode = "edit";
    appState.modalParams.type = type;
    appState.modalParams.elemID = elemID;
    let data = appState.queryData.find(elem => {
        if (+elem.id === +elemID) {
            return elem;
        }
    });
    appState.modalParams.ensembleID = data.ensembleId || null;
    initModal(type, data)
});


function initModal(type, data) {
    let modalBody = "";
    switch (type) {
        case "plate":
            modalBody = getPlateModalBody(data);
            break;
        case "ensemble":
            modalBody = getEnsembleModalBody(data);
            break;
    }
    $(".modal-body").html(modalBody);
}
function getPlateModalBody(data) {
    let compositions = getPlateCompositionsBody(data);
    return `
        <div class="form-group">
            <label for="plateName">Имя: </label>
            <input type="text" class="form-control" id="plateName" value="${data.name}">
        </div>
        <div class="form-group">
            <label for="description">Описание: </label>
            <textarea type="text" class="form-control" id="description" type="description">${data.description}</textarea>
        </div>
        <div class="form-group">
            <label for="producer">Производитель: </label>
            <input type="text" class="form-control" id="producer" type="producer" value="${data.producedBy}">
        </div>
        <div class="form-group">
            <label for="wholesaler">Оптовый продавец: </label>
            <input type="text" class="form-control" id="wholesaler" value="${data.wholesaler}">
        </div>
        <div class="form-group">
            <label for="retailPrice">Розничная цена: </label>
            <input type="number" class="form-control" id="retailPrice" type="retailPrice" value="${data.retailPrice}" min="1"/>
        </div>
        <div class="form-group">
            <label for="wholesalePrice">Оптовая цена: </label>
            <input type="number" class="form-control" id="wholesalePrice" type="wholesalePrice" value="${data.wholesalePrice}" min="1"/>
        </div>
        <div class="form-group">
            ${appState.modalParams.elemID !== 0 && `<label for="newSong">Добавить песню: </label>
            <input type="text" class="form-control" id="newSong"/>
            <input id="addComposition" type="button" class="btn btn-primary" value="Добавить">` || ""}
        </div>
        <div class="list-group list-compositions">
            ${compositions}
        </div>
    `;
}

$(document).on("click", "#addComposition", function () {
    let name = $("#newSong").val();
    if (name.length === 0) {
        alert("Введите название добавляемой песни!");
        return;
    }

    $.post({
        url: "/plate_composition",
        contentType: "application/json",
        data: JSON.stringify({
            plateId: appState.modalParams.elemID,
            ensembleId: appState.modalParams.ensembleID,
            compositionName: name,
        }),
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                alert("Успешно добавлено!");
                $(".list-compositions").append(`<a onclick="deleteFromPlate(${result.response})" href="#" id="composition_${result.response}" class="list-group-item list-group-item-action">${name}</a>`)
            } else {
                alert("Данная песня не найдена у ансамбля пластинки!")
            }
        },
    });
});

function deleteFromPlate(compositionID) {
    $.ajax({
        type: 'DELETE',
        url: "/plate_composition",
        contentType: "application/json",
        data: JSON.stringify({
            compositionId: compositionID
        }),
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                alert("Успешно удалено!");
                $(`#composition_${compositionID}`).remove();
            } else {
                alert("Что-то пошло не так!")
            }
        },
    });
}

function getPlateCompositionsBody(data) {
    console.log(data);
    if (!data.compositionName || data.compositionName.length === 0 || !data.compositionName[0]) {
        return [];
    }
    let res = "";
    data.compositionName.forEach((composition, i) => {
        res += `<a onclick="deleteFromPlate(${data.compositionIds[i]})" href="#" id="composition_${data.compositionIds[i]}" class="list-group-item list-group-item-action">${composition}</a>`
    });
    return res;
}

function getEnsembleModalBody(data) {
    return `
        <div class="form-group">
            <label for="ensembleName">Название ансамбля: </label>
            <input type="text" class="form-control" id="ensembleName" type="name" value="${data.name}">
        </div>
        <div class="form-group">
            <label for="description">Описание: </label>
            <textarea type="text" class="form-control" id="description" type="description">${data.description}</textarea>
        </div>
        <div class="form-group">
            <label for="ensemble_type">Тип ансамбля: </label>
            <select type="text" class="form-control" id="ensemble_type" type="ensemble_type">
                <option ${data.type === "solo" && "selected"} value="solo">solo</option>
                <option ${data.type === "duet" && "selected"} value="duet">duet</option>
                <option ${data.type === "trio" && "selected"} value="trio">trio</option>
                <option ${data.type === "quartet" && "selected"} value="quartet">quartet</option>
                <option ${data.type === "quintet" && "selected"} value="quintet">quintet</option>
                <option ${data.type === "other" && "selected"} value="other">other</option>
            </select>
        </div>
    `;
}

function search(type, name) {
    $.get({
        url: "/search",
        data: {type, filters: {name}},
        success: function (data) {
            let result = JSON.parse(data);
            if (result.errNo === 0) {
                appState.queryData = result.response;
                if (result.response.length === 0) {
                    $(".cards").html(`<h2 style="margin-left: 10px;">К сожалению ничего не найдено...<label for="name"><span class="badge badge-secondary" style="margin-left: 15px; cursor: pointer">Попробуйте другой запрос</span></label></h2>`);
                    return;
                }
                $(".cards").html("");
                result.response.forEach(res => {
                    $(".cards").append(createCard({name: res.name, description: res.description, type:res.queryType, id:res.id}, isAdmin));
                });
            }
        },
    });
}

function relocateTo(path) {
    window.location.replace(path);
}

function createCard(params, isAdmin) {
    return `
        <div class="col-md-4 card-wrap">
          <div class="card mb-4 shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">${params.name}</text></svg>
            <div class="card-body">
              <p class="card-text">${params.description || ""}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" onclick='relocateTo("/${params.type}/${params.id}")' class="btn btn-sm btn-outline-secondary">Просмотреть</button>
                  ${isAdmin && '<button type="button" id="change" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#myModal" value=\"' + params.id + '\">Редактировать</button>' || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
    `;
}