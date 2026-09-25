const musicSections = [
    {
        title: "Epic Adventure",
        tracks: [
            {
                name: "Interstellar Outlaws",
                description: "You just met \"The Crew\" and you'll be up to no good as you travel the stars. Okay, that actually sounds like a pretty cool game idea.",
                filePath: "audio/interstellar-outlaws.mp3"
            },
            {
                name: "Adapt or Die!",
                description: "In the middle of escaping a high-containment facility, the alarms suddenly go off. Can you make it out in time?",
                filePath: "audio/adapt-or-die.mp3"
            },
            {
                name: "We Ride, We Fight!",
                description: "Imagine playing Halo, hopping in a Warthog, and cruising down the canyon blasting away at the Covenant. I made this one a while back and it's still one of my favorites! The string section comes in hard at 19 seconds.",
                filePath: "audio/we-ride-we-fight.mp3"
            },
            {
                name: "Conquest and Regret",
                description: "Skyrim in space. You're the hero, but at what cost? This is one of my best for the string section.",
                filePath: "audio/conquest-and-regret.mp3"
            },

            {
                name: "Glory",
                description: "Did I just fly for the first time?",
                filePath: "audio/glory.mp3"
            },
            {
                name: "Champion Battle",
                description: "Once upon a time I was making my own Pokémon game using vanilla JavaScript. Was it too ambitious of a project? Yes. Did I make a killer theme for the final champion battle? Also yes. I wanted to replicate the feeling of battling Cynthia or N on the Nintendo DS.",
                filePath: "audio/champion-battle.mp3"
            }
        ]
    },
    {
        title: "Soft Fantasy",
        tracks: [
            {
                name: "Lush and Brush",
                description: "Greenpath by Christopher Larkin was undoubtedly my reference track. Man, that's a good song.",
                filePath: "audio/lush-and-brush.mp3"
            },
            {
                name: "Earth Sleeps",
                description: "I was studying the Hogwarts Legacy soundtrack when I composed this. It's like the Earth is having a good dream...",
                filePath: "audio/earth-sleeps.mp3"
            },
            {
                name: "The Forest Says Hello",
                description: "You just learned to double jump. Let's see if you can get through this strange forest now.",
                filePath: "audio/the-forest-says-hello.mp3"
            },
            {
                name: "Dream Floor",
                description: "The dream begins. You just arrived in a heavenly room where new abilities and secrets await. I guess I can compose in the major key after all.",
                filePath: "audio/dream-floor.mp3"
            },
        ]
    },
];

const musicContainer = document.querySelector("#music-container");

musicContainer.innerHTML = musicSections.map((section) => `
    <section class="music-section" id="${createSectionId(section.title)}">
        <h2>${section.title}</h2>
        ${section.tracks.map(createTrackMarkup).join("")}
    </section>
`).join("");

document.querySelectorAll(".section-nav-button").forEach((button) => {
    button.addEventListener("click", () => {
        document
            .querySelector(`#${button.dataset.section}`)
            .scrollIntoView({ behavior: "smooth" });
    });
});

const players = document.querySelectorAll(".audio-player");

function createTrackMarkup(track) {
    return `
        <article class="track">
            <h3>${track.name}</h3>

            <div class="audio-player">
                <audio class="audio-element">
                    <source src="${track.filePath}" type="audio/mpeg">
                </audio>

                <button class="play-button" aria-label="Play ${track.name}">
                    ▶
                </button>

                <div class="player-content">
                    <div class="player-top">
                        <span class="player-title">${track.name}</span>
                        <span class="player-time">0:00 / 0:00</span>
                    </div>

                    <input
                        class="progress-bar"
                        type="range"
                        min="0"
                        max="100"
                        value="0"
                        aria-label="${track.name} progress">
                </div>
            </div>

            <p>${track.description}</p>
        </article>
    `;
}

function createSectionId(title) {
    return title.toLowerCase().replaceAll(" ", "-");
}

players.forEach((player) => {
    const audio = player.querySelector(".audio-element");
    const playButton = player.querySelector(".play-button");
    const progressBar = player.querySelector(".progress-bar");
    const timeDisplay = player.querySelector(".player-time");

    playButton.addEventListener("click", () => {
        if (audio.paused) {
            // Stop every other track
            players.forEach((otherPlayer) => {
                const otherAudio =
                    otherPlayer.querySelector(".audio-element");

                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });

            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("play", () => {
        playButton.textContent = "Ⅱ";
    });

    audio.addEventListener("pause", () => {
        playButton.textContent = "▶";
    });

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) {
            return;
        }

        const progress =
            (audio.currentTime / audio.duration) * 100;

        progressBar.value = progress;

        timeDisplay.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    progressBar.addEventListener("input", () => {
        if (!audio.duration) {
            return;
        }

        audio.currentTime =
            (progressBar.value / 100) * audio.duration;
    });

    audio.addEventListener("loadedmetadata", () => {
        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener("ended", () => {
        progressBar.value = 0;
        playButton.textContent = "▶";
        timeDisplay.textContent =
            `0:00 / ${formatTime(audio.duration)}`;
    });
});


function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =
        Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}