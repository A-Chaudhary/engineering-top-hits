let audioFeatures= [
    {
        name: "Acousticness",
        color: "#509BF5",
        description: "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. Think of accousticness as the absence of drums or a clear bass line.",
        image: "static/images/audio-cards/acoustic.png",
        zeroText: "0 = Low Acousticness",
        oneText: "1 = High Acousticness",
        zeroAudio: "https://open.spotify.com/embed/track/1LYNuVLtV374Iy7vlHy6BO?utm_source=generator=theme=0",
        oneAudio: "https://open.spotify.com/embed/track/30Co9eN7JHPf1i2wEyVSMJ?utm_source=generator&theme=0"
    },
    {
        name: "Danceability",
        color: "#F573A0",
        description: "How suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. ",
        image: "static/images/audio-cards/dance.png",
        zeroText: "0 = Low Dancability",
        oneText: "1 = High Dancability",
        zeroAudio: "https://open.spotify.com/embed/track/7JURn7T7Tq3wszT0aEieBM?utm_source=generator&theme=0",
        oneAudio: "https://open.spotify.com/embed/track/3sy0rren2cVFNfkDxa0q2e?utm_source=generator&theme=0"
    },
    {
        name: "Energy",
        color: "#FF4632",
        description: "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
        image: "static/images/audio-cards/energy.png",
        zeroText: "0 = Low Energy",
        oneText: "1 = High Energy",
        zeroAudio: "https://open.spotify.com/embed/track/6gGboAhqHBqs5szVLobC41?utm_source=generator&theme=0",
        oneAudio: "https://open.spotify.com/embed/track/3Uo9Bpx6eoh3riOwNY3tyS?utm_source=generator&theme=0"
    },
    {
        name: "Instrumentalness",
        color: "#FFC564",
        description: "Predicts whether a track contains no vocals. 'Ooh' and 'aah' sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly 'vocal'.",
        image: "static/images/audio-cards/instrumental.png",
        zeroText: "0 = No Instrumentals (Mostly Lyrics)",
        oneText: "1 = High Instrumentals (NO Lyrics)",
        zeroAudio: "https://open.spotify.com/embed/track/2qxmye6gAegTMjLKEBoR3d?utm_source=generator&theme=0",
        oneAudio: "https://open.spotify.com/embed/track/6Sy9BUbgFse0n0LPA5lwy5?utm_source=generator&theme=0"
    },
    {
        name: "Liveness",
        color: "#6E4E73",
        description: "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
        image: "static/images/audio-cards/live.png",
        zeroText: "0 = Pre-Recorded",
        oneText: "1 = Performed & Recorded Live",
        zeroAudio: "https://open.spotify.com/embed/track/3yrvQHw6pQemsrCQEpMnKv?utm_source=generator&theme=0",
        oneAudio: "https://open.spotify.com/embed/track/3k3QGyFyA5qrT5BLqeU1Ss?utm_source=generator&theme=0"
    },
    {
        name: "Speechiness",
        color: "#1ED760",
        description: "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.",
        image: "static/images/audio-cards/speech.png",
        zeroText: "0 = All Vocal/Lyrics",
        oneText: "1 = All Spoken Words",
        zeroAudio: "https://open.spotify.com/embed/track/63kd4m3VFxcJjPVVtbVNAu?utm_source=generator&theme=0",
        oneAudio: "https://open.spotify.com/embed/track/08SAg9qnUdWVQV2Jbj7cu8?utm_source=generator&theme=0"
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
    $("#audio-info").hide()
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
            loadAudioInfo(value)
            $('#audio-info').show()
        })

        $('#feature-grid').append(card)
    }) 
}

function loadAudioInfo(info) {
    $("#audio-info").empty();
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