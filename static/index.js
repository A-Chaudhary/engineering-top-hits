// import {Legend, Swatches} from "@d3/color-legend"
$(document).ready(function () {
    $(".popup").hide()
    $("#audio-info").hide()
    $("#go-back").hide()

    loadData()
});

$("#go-back").click(function () {
    $("#audio-info").empty();
    $("#action-text").show()
    $("#go-back").hide()
    $("#audio-info").hide()
    $('#feature-grid .audio-card').show();
    $('#feature-grid .audio-card').removeClass("audio-card-transition").removeClass("long-feature-card");
    $(".feature-description").hide();
    $(".icon-card").show();
})

function loadData() {
    fetch("static/audio_features.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {  loadAudioFeatureGrid(data) })
        .catch((error) => 
                console.error("Unable to fetch data:", error));
}

function loadAudioFeatureGrid(audioFeatures) {
    console.log(audioFeatures)
    $.each(audioFeatures, function (index, value) {
        let card = $(`<div class='audio-card p-2 g-col-4' id=${value.name}>`)
        let title = $("<div class='card-title'>").html(value.name)
        let iconCard = $("<div class='icon-card'>")
        let description = $("<div class='feature-description'>").html(value.description)
        let image =  $(`<img src='${value.image}' class='icon'>`)

        $(iconCard).append(image)
        $(card).append(title).append(description).append(iconCard)
        $(card).css("background-color", value.color)
        $(card).find(".feature-description").hide();
        
        //add click handler to button
        $(card).click(function(){
            $("#action-text").hide()
            $("#go-back").show()
            $(this).addClass("audio-card-transition")
            $(this).find(".icon-card").hide();
            $(this).addClass("long-feature-card")
            //hide all other categories
            for (let i = 0; i < audioFeatures.length; i++) {
                if (audioFeatures[i].name != value.name) {
                    console.log(`${audioFeatures[i].name}`)
                    $(`#${audioFeatures[i].name}`).hide()
                } 
            }

            $(this).find(".feature-description").show();
            loadAudioInfo(value)
            $('#audio-info').show()
        })

        $('#feature-grid').append(card)
    }) 
}

function loadAudioInfo(info) {
    let card = $(`<div class='long-feature-card' style="margin-top: 2%;">`)
    let leftSection = $(`<div style="text-align: left">`)
    let rightSection = $(`<div style="text-align: right">`)
    let imgSection = $(`<div>`)
    let wave = $(`<img src="static/images/wave.gif" class="wave">`)

    let zeroText = $(`<div class="audio-scale-text">`).html(info.zeroText)
    let oneText = $(`<div class="audio-scale-text">`).html(info.oneText)
    let zeroAudio= $(`<iframe class="audio-embed" src=${info.zeroAudio} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">`)
    let oneAudio = $(`<iframe class="audio-embed" src=${info.oneAudio} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">`)

    leftSection.append(zeroText).append(zeroAudio)
    rightSection.append(oneText).append(oneAudio)
    imgSection.append(wave)

    card.append(leftSection).append(rightSection)
    $("#audio-info").append(imgSection).append(card)
}