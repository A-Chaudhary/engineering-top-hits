let audioFeatures= [
    {
        name: "Acousticness",
        color: "#509BF5",
        description: "A confidence measure from 0.0 to 1.0 of whether the track is acoustic.",
        image: "static/images/audio-cards/acoustic.png"
    },
    {
        name: "Danceability",
        color: "#F573A0",
        description: "How suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. ",
        image: "static/images/audio-cards/dance.png"
    },
    {
        name: "Energy",
        color: "#FF4632",
        description: "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
        image: "static/images/audio-cards/energy.png"
    },
    {
        name: "Instrumentalness",
        color: "#FFC564",
        description: "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'.",
        image: "static/images/audio-cards/instrumental.png"
    },
    {
        name: "Liveness",
        color: "#6E4E73",
        description: "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
        image: "static/images/audio-cards/live.png"
    },
    {
        name: "Speechiness",
        color: "#1ED760",
        description: "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.",
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
    $('#feature-grid .audio-card').removeClass("audio-card-transition").removeClass("long-feature-card");
    $(".feature-description").hide();
    $(".icon-card").show();
})

function loadAudioFeatureGrid() {
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
        })

        $('#feature-grid').append(card)
    }) 
}