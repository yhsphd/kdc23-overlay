let lobby_acronymElements = document.getElementById("topbar").querySelector(".acronym");
let lobby_teamNameElements = document.getElementsByClassName("teamName");
let lobby_leftBoxElement = document.getElementById("leftBox");
let lobby_bracketElement = document.getElementById("bracket");
let lobby_matchCodeElement = document.getElementById("matchCode");
let lobby_chatBoxElement = document.getElementById("chatBox");
let lobby_scoreBoxElement = document.getElementById("scoreBox");
let lobby_scoreElements = document.getElementsByClassName("scoreBox-teamBox-scoreSum");
let lobby_accElements = document.getElementsByClassName("scoreBox-teamBox-accAvg");
let lobby_scoreDiffElement = document.getElementById("scoreDiff");
let lobby_diffSpeedArrowElement = document.getElementById("diffSpeed");
let lobby_diffSpeedRotatorElement = document.getElementById("diffSpeedRotator");
let lobby_diffSpeedValueContainerElement = document.getElementById("diffSpeedValueContainer");
let lobby_diffSpeedValueElement = document.getElementById("diffSpeedValue");

const lobby_update_interval = 100;


//
// Utils


//
// UI Update Functions

function lobby_updateMatchInfo(overlayData) {
    lobby_bracketElement.innerText = overlayData.bracket;
    lobby_matchCodeElement.innerText = overlayData.match_code;
}

function lobby_updateTeams(teams) {
    for (let i = 0; i > 2; i++) {
        lobby_acronymElements.innerText = teams[i].acronym;
        lobby_teamNameElements.innerText = teams[i].name;
    }
}

function lobby_showChat(hide = false) {
    transitionCrossfadeElements(lobby_scoreBoxElement, lobby_chatBoxElement, 300);
    chatVisible = true;
}

function lobby_showScores(hide = false) {
    transitionCrossfadeElements(lobby_chatBoxElement, lobby_scoreBoxElement, 300);
    chatVisible = false;
}


let scoreDiffLog = [];

function lobby_updateScores(lobby) {
    lobby_scoreElements[0].innerText = numberWithCommas(lobby.scores[0]);
    lobby_scoreElements[1].innerText = numberWithCommas(lobby.scores[1]);

    let diff = lobby.scores[0] - lobby.scores[1];
    lobby_scoreDiffElement.innerText = numberWithCommas(Math.abs(diff));

    lobby_accElements[0].innerText = ((lobby.players[0].acc + lobby.players[1].acc) / 2).toFixed(2) + "%";
    lobby_accElements[1].innerText = ((lobby.players[2].acc + lobby.players[3].acc) / 2).toFixed(2) + "%";

    //Add diffspeed
    scoreDiffLog.push(diff);
    let diffSpeed = (diff - scoreDiffLog[0]) * (1000 / (lobby_update_interval * (scoreDiffLog.length - 1)));
    if (scoreDiffLog.length === 11) {
        scoreDiffLog.shift();
    }
    lobby_diffSpeedValueElement.innerText = numberWithCommas(Math.abs(diffSpeed));
    lobby_diffSpeedArrowElement.style.width = clampNumber(Math.abs(diffSpeed) * 60 / 50000, 0, 60) + "%";
    if (diffSpeed >= 0) {
        lobby_diffSpeedRotatorElement.style.transform = "rotate(180deg)";
        lobby_diffSpeedValueContainerElement.style.textAlign = "right";
    } else {
        lobby_diffSpeedRotatorElement.style.transform = "";
        lobby_diffSpeedValueContainerElement.style.textAlign = "left";
    }
}

let chatVisible = true;
let tempState = -1;
// Updates visibilities of chat/scores, leaderboard/mapcompacts
function lobby_updateVisibilities(overlayData) {
    if (tempState !== overlayData.progress.state) {
        tempState = overlayData.progress.state;
        if (tempState === 1) {
            lobby_showChat();
        } else {
            lobby_showScores();
        }
    }
    if (tempState === 4 && overlayData.teams[0].score === 0 && !chatVisible) {
        lobby_showChat();
    }
}


//
// Update Function

function lobby_update() {
    lobby_updateMatchInfo(overlayData);
    lobby_updateTeams(overlayData.teams);
    chat_updateChat(overlayData.chat, lobby_chatBoxElement);
    lobby_updateVisibilities(overlayData);
}

setInterval(lobby_update, lobby_update_interval);