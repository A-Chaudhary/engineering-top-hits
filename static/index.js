let audioFeatures= [
    {
        name: "Acousticness",
        color: "#509BF5",
        image: "static/images/audio-cards/acoustic.png"
    },
    {
        name: "Danceability",
        color: "#F573A0",
        image: "static/images/audio-cards/dance.png"
    },
    {
        name: "Energy",
        color: "#FF4632",
        image: "static/images/audio-cards/energy.png"
    },
    {
        name: "Instrumentalness",
        color: "#FFC564",
        image: "static/images/audio-cards/instrumental.png"
    },
    {
        name: "Liveness",
        color: "#6E4E73",
        image: "static/images/audio-cards/live.png"
    },
    {
        name: "Speechiness",
        color: "#1ED760",
        image: "static/images/audio-cards/speech.png"
    }
]

$(document).ready(function () {
    $("#audio-info").hide()
    $("#go-back").hide()

    loadAudioFeatureGrid()
});

$("#go-back").click(function () {
    $("#action-text").show()
    $("#go-back").hide()
    $('#feature-grid .audio-card').show();
})

function loadAudioFeatureGrid() {
    $.each(audioFeatures, function (index, value) {
        let card = $(`<div class='audio-card p-2 g-col-4' id=${value.name}>`)
        let title = $("<div class='card-title'>").html(value.name)
        let iconCard =  $("<div class='icon-card'>")
        let image =  $(`<img src='${value.image}' class='icon'>`)

        $(iconCard).append(image)
        $(card).append(title).append(iconCard)
        $(card).css("background-color", value.color)
        //add click handler to button
        $(card).click(function(){
            $("#action-text").hide()
            $("#go-back").show()
            
            //hide all other categories
            for (let i = 0; i < audioFeatures.length; i++) {
                if (audioFeatures[i].name != value.name) {
                    console.log(`${audioFeatures[i].name}`)
                    $(`#${audioFeatures[i].name}`).hide()
                } 
            }
        })

        $('#feature-grid').append(card)
    }) 
}