import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build, transform } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const axios = require("axios");

async function load(relativePath) {
    const filename = path.join(root, relativePath);
    const result = await build({
        entryPoints: [filename],
        bundle: true,
        write: false,
        platform: "node",
        format: "cjs",
        packages: "external",
        plugins: [{
            name: "inertia-esm",
            setup(build) {
                build.onResolve({ filter: /^@inertiajs\/(react|core)$/ }, ({ path: name }) => ({
                    path: path.join(root, "node_modules", name, "dist", "index.esm.js"),
                }));
            },
        }],
        loader: { ".js": "jsx" },
        jsx: "automatic",
        alias: { "@": path.join(root, "resources", "js") },
    });
    const compiled = new Module(filename);
    compiled.filename = filename;
    compiled.require = require;
    compiled._compile(result.outputFiles[0].text, filename);
    return compiled.exports;
}

const slice = await load("resources/js/app/redux/engagement-slice.js");
const postEventSlice = await load("resources/js/app/redux/post-event-survey-slice.js");
const thunks = await load("resources/js/app/redux/engagement-thunk.js");
const services = await load("resources/js/app/services/engagement-service.js");
const Survey = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-survey-section.jsx")).default;
const Submitted = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submitted-section.jsx")).default;
const Progress = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-progress-section.jsx")).default;
const SubmitProof = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-submit-section.jsx")).default;
const ChallengeFlow = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-section.jsx")).default;
const Details = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-details-section.jsx")).default;
const Approved = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-flow-approved-section.jsx")).default;
const Profile = (await load("resources/js/app/pages/accounts/_employee/rnr/my_profile/sections/points-summary-section.jsx")).default;
const Cards = (await load("resources/js/app/pages/accounts/_employee/rnr/challenge_event/sections/challenge-card-section.jsx")).default;
const SurveyTable = await load("resources/js/app/pages/accounts/_administrator/activities/post_event_survey/sections/table-section.jsx");
const SubmissionTable = (await load("resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx")).default;
const SubmissionPagination = (await load("resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/pagination-section.jsx")).default;
const TopLeaderboard = (await load("resources/js/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/top-participant-section.jsx")).default;
const ParticipantLeaderboard = (await load("resources/js/app/pages/accounts/_administrator/rnr/challenges_events/leaderboard/sections/participant-table-section.jsx")).default;

const challenge = {
    id: 12, title: "Wellness", survey_required: true, is_joined: true,
    status: "Active", participation_status: "submitted", survey_reward_points: 15,
    points: 100, submitted_at: "2026-10-12", reviewed_at: "2026-10-12",
};
const survey = {
    challenge_id: 12, reward_points: 15, can_submit: true, user_has_responded: false,
    questions: Array.from({ length: 7 }, (_, index) => ({
        id: index + 1, question_text: `Question ${index + 1}`,
        question_type: index < 4 ? "rating" : "paragraph",
        is_required: index < 4, rating_min: index < 4 ? 1 : null,
        rating_max: index < 4 ? 5 : null,
    })),
};
const completion = {
    challenge_id: 12, survey_completed: true, survey_completed_at: "2026-10-12 18:00:00",
    participation_status: "approved", proof_approved_at: "2026-10-12 17:00:00",
    challenge_points_awarded: 100, survey_points_awarded: 15, total_points_awarded: 115,
};

function store(overrides = {}, appData = { user: { is_er_leader: false } }) {
    return configureStore({
        reducer: {
            engagement: slice.default,
            app: (state = { data: appData }) => state,
        },
        preloadedState: { engagement: {
            ...slice.default(undefined, { type: "@@init" }),
            myRewardChallenges: [challenge],
            ...overrides,
        }, app: { data: appData } },
    });
}
function render(Component, state = {}, props = {}, appData) {
    globalThis.window = {
        location: {
            pathname: "/accounts/employee/rnr/my_profile",
            search: "",
            href: "http://localhost/accounts/employee/rnr/my_profile",
            toString() {
                return this.href;
            },
        },
    };
    return renderToStaticMarkup(React.createElement(Provider, { store: store(state, appData) },
        React.createElement(Component, { challenge, onBack() {}, onClose() {}, ...props })));
}
function adapter(handler) {
    axios.defaults.adapter = async (config) => ({
        config, status: 200, statusText: "OK", headers: {}, data: await handler(config),
    });
}

test("services target the exact challenge and return JSON, not Axios wrappers", async () => {
    const requests = [];
    adapter((config) => { requests.push(config); return { data: survey }; });
    assert.deepEqual(await services.get_reward_challenge_survey_service(12), { data: survey });
    await services.submit_reward_challenge_survey_service(12, { 1: 5 });
    await services.approve_reward_challenge_submission_service("team-9", 15);
    assert.equal(requests[0].url, "/api/engagement/reward-challenges/12/survey");
    assert.equal(requests[1].url, "/api/engagement/reward-challenges/12/survey/submit");
    assert.deepEqual(JSON.parse(requests[1].data), { answers: { 1: 5 } });
    assert.equal(requests[2].url, "/api/engagement/reward-challenge-submissions/team-9/approve");
    assert.deepEqual(JSON.parse(requests[2].data), { bonus_points: 15 });
});

test("the selected submissions tab is shared with export and team rows use the leader", () => {
    const html = render(SubmissionTable, {
        challengeSubmissions: [
            {
                id: "individual-1",
                challenge: { title: "Individual Challenge", points: 100 },
                employee: { name: "Individual Export Row" },
            },
            {
                id: "team-1",
                challenge: { title: "Team Challenge", points: 100 },
                employee: { name: "Team Export Leader" },
                employees: [{ id: 3, name: "Team Member" }],
            },
        ],
    }, {
        filters: {},
        submissionType: "team",
        setSubmissionType() {},
    });
    assert.match(html, /aria-pressed="true"[^>]*>Team \(1\)/);
    assert.match(html, /Team Export Leader/);
    assert.doesNotMatch(html, /Individual Export Row/);

    const searchSource = readFileSync(path.join(
        root,
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/search-section.jsx",
    ), "utf8");
    assert.match(searchSource, /params\.submission_type = submissionType/);
    assert.match(searchSource, /export_reward_challenge_submissions_service\(params\)/);
    const pageSource = readFileSync(path.join(
        root,
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/page.jsx",
    ), "utf8");
    assert.match(pageSource, /submissionType=\{submissionType\}/);
    assert.match(pageSource, /setSubmissionType=\{setSubmissionType\}/);
});

test("eligible leaders retain both submission tabs after individual proof is submitted", () => {
    const html = render(SubmitProof, {}, {
        challenge: {
            ...challenge,
            type: "Team",
            participation_status: "submitted",
        },
        canSubmitTeam: true,
        individualSubmitted: true,
        isOpen: true,
    });
    assert.match(html, /Individual submission/);
    assert.match(html, /Team submission/);
    assert.match(html, /Your individual proof has already been recorded/);
    assert.doesNotMatch(html, /Submit for Review/);
});

test("an earlier team submission does not hide the individual submission option", () => {
    const html = render(SubmitProof, {}, {
        challenge: {
            ...challenge,
            type: "Team",
            team_submission_status: "submitted",
            team_submission_locked: true,
        },
        canSubmitTeam: true,
        isOpen: true,
    });
    assert.match(html, /Individual submission/);
    assert.match(html, /Team submission/);
    assert.match(html, /Upload a photo as proof/);
});

test("team submission tabs remain role-gated and unavailable to non-leaders", () => {
    const html = render(SubmitProof, {}, {
        challenge: { ...challenge, type: "Team" },
        isOpen: true,
    });
    assert.doesNotMatch(html, /Team submission/);
});

test("daily proof service uploads the proof without a client-selected date", async () => {
    const requests = [];
    adapter((config) => {
        requests.push(config);
        return { data: { status: "success" } };
    });
    await services.submit_reward_challenge_daily_proof_service(
        12,
        new Blob(["proof"], { type: "image/png" }),
        "Completed the daily activity",
    );
    assert.equal(requests[0].url, "/api/engagement/reward-challenges/12/submit-daily");
    assert.equal(requests[0].data.get("log_date"), null);
    assert.equal(requests[0].data.get("challenge_description"), "Completed the daily activity");
});

test("editing a challenge can clear its optional duration", async () => {
    let request;
    adapter((config) => {
        request = config;
        return { data: { status: "success" } };
    });
    await store().dispatch(thunks.update_engagement_reward_challenge_thunk({
        id: 12,
        data: { duration_days: null },
    }));
    assert.equal(request.data.get("duration_days"), "");
});

test("duration challenge forms compile and present the duration field", async () => {
    for (const relativePath of [
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/sections/create-new-challenge.jsx",
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/dashboard/sections/edit-challenge-section.jsx",
    ]) {
        const filename = path.join(root, relativePath);
        const source = readFileSync(filename, "utf8");
        assert.match(source, /Duration \(days\) — optional/);
        assert.doesNotMatch(source, /submission_weekdays|CHALLENGE_WEEKDAYS/);
        await transform(source, { loader: "jsx" });
    }
});

test("daily proof form explains duration progress and daily submission behavior", () => {
    const html = render(SubmitProof, {}, {
        challenge: {
            ...challenge,
            is_daily_challenge: true,
            required_days: 3,
            completed_days: 0,
        },
        isOpen: true,
    });
    assert.match(html, /Day 1 of 3/);
    assert.doesNotMatch(html, /Scheduled proof date/);
    const details = render(Details, {}, {
        challenge: { ...challenge, is_daily_challenge: true, duration_days: 3 },
    });
    assert.match(details, /3 day\(s\), 1 proof\/day/);
});

test("fetch errors remain visible and retry clears the error", async () => {
    const state = store();
    axios.defaults.adapter = async () => { throw { response: { data: { message: "Forbidden" } } }; };
    await state.dispatch(thunks.get_engagement_reward_challenge_survey_thunk(12));
    assert.equal(state.getState().engagement.rewardChallengeSurveys[12].error.message, "Forbidden");
    adapter(() => ({ data: survey }));
    await state.dispatch(thunks.get_engagement_reward_challenge_survey_thunk(12));
    assert.equal(state.getState().engagement.rewardChallengeSurveys[12].error, null);
    assert.equal(state.getState().engagement.rewardChallengeSurveys[12].data.questions.length, 7);
});

test("concurrent survey loads issue one request and keep one question set", async () => {
    let resolve;
    let requestCount = 0;
    axios.defaults.adapter = async (config) => {
        requestCount++;
        return await new Promise((done) => {
            resolve = () => done({
                config, status: 200, headers: {}, data: { data: survey },
            });
        });
    };

    const state = store();
    const first = state.dispatch(thunks.get_engagement_reward_challenge_survey_thunk(12));
    const second = await state.dispatch(thunks.get_engagement_reward_challenge_survey_thunk(12));
    assert.equal(second.meta.condition, true);
    assert.equal(requestCount, 1);

    resolve();
    await first;
    assert.equal(state.getState().engagement.rewardChallengeSurveys[12].data.questions.length, 7);
});

test("late survey fetches cannot replace a newer response or another challenge", () => {
    const state = store();
    const fetch = thunks.get_engagement_reward_challenge_survey_thunk;
    state.dispatch(fetch.pending("old", 12));
    state.dispatch(fetch.pending("new", 12));
    state.dispatch(fetch.pending("other", 99));
    state.dispatch(fetch.fulfilled({ data: survey }, "new", 12));
    state.dispatch(fetch.fulfilled({ data: { ...survey, can_submit: false } }, "old", 12));
    assert.equal(state.getState().engagement.rewardChallengeSurveys[12].data.can_submit, true);
    assert.equal(state.getState().engagement.rewardChallengeSurveys[99].loading, true);
});

test("a stale profile request cannot erase newly refreshed survey points", () => {
    const state = store();
    const fetch = thunks.get_engagement_reward_challenge_profile_summary_thunk;
    state.dispatch(fetch.pending("old"));
    state.dispatch(fetch.pending("new"));
    state.dispatch(fetch.fulfilled({ data: { total_points: 115, challenge_history: [] } }, "new"));
    state.dispatch(fetch.fulfilled({ data: { total_points: 0, challenge_history: [] } }, "old"));
    assert.equal(state.getState().engagement.challengeProfileSummary.total_points, 115);
});

test("successful submission updates persisted UI fields and refreshes balance/history", async () => {
    const urls = [];
    adapter((config) => {
        urls.push(config.url);
        return config.url.endsWith("/profile-summary")
            ? { data: { total_points: 115, challenge_history: [{ ...completion, id: 1 }] } }
            : { data: completion };
    });
    const state = store({ rewardChallengeSurveys: { 12: { data: survey } } });
    await state.dispatch(thunks.submit_engagement_reward_challenge_survey_thunk({ id: 12, answers: { 1: 5 } }));
    await new Promise((resolve) => setImmediate(resolve));
    const engagement = state.getState().engagement;
    assert.equal(engagement.myRewardChallenges[0].survey_completed, true);
    assert.equal(engagement.myRewardChallenges[0].participation_status, "approved");
    assert.equal(engagement.myRewardChallenges[0].can_complete_survey, false);
    assert.equal(engagement.myRewardChallenges[0].total_points_awarded, 115);
    assert.equal(engagement.rewardChallengeSurveys[12].data.user_has_responded, true);
    assert.equal(engagement.challengeProfileSummary.total_points, 115);
    assert.equal(engagement.challengeProfileSummary.challenge_history[0].survey_points_awarded, 15);
    assert.ok(urls.includes("/api/engagement/reward-challenges/profile-summary"));
});

test("failed submission preserves pending state and field validation errors", async () => {
    axios.defaults.adapter = async () => { throw { response: { data: { message: "Invalid rating", errors: { "answers.1": ["Choose a rating"] } } } }; };
    const state = store({ rewardChallengeSurveys: { 12: { data: survey } } });
    await state.dispatch(thunks.submit_engagement_reward_challenge_survey_thunk({ id: 12, answers: {} }));
    const engagement = state.getState().engagement;
    assert.equal(engagement.myRewardChallenges[0].participation_status, "submitted");
    assert.equal(engagement.myRewardChallenges[0].survey_completed, undefined);
    assert.deepEqual(engagement.rewardChallengeSurveys[12].submitError.errors["answers.1"], ["Choose a rating"]);
    assert.equal(engagement.rewardChallengeSurveys[12].submitting, false);
});

test("rapid duplicate clicks dispatch only one survey request", async () => {
    let resolve;
    let count = 0;
    axios.defaults.adapter = async (config) => {
        if (config.url.endsWith("/profile-summary")) return { config, status: 200, headers: {}, data: { data: { total_points: 115, challenge_history: [] } } };
        count++;
        return await new Promise((done) => { resolve = () => done({ config, status: 200, headers: {}, data: { data: completion } }); });
    };
    const state = store();
    const first = state.dispatch(thunks.submit_engagement_reward_challenge_survey_thunk({ id: 12, answers: {} }));
    const second = await state.dispatch(thunks.submit_engagement_reward_challenge_survey_thunk({ id: 12, answers: {} }));
    assert.equal(second.meta.condition, true);
    assert.equal(count, 1);
    resolve();
    await first;
});

test("survey form renders exactly 20 rating choices and three paragraphs", () => {
    const html = render(Survey, { rewardChallengeSurveys: { 12: { data: survey } } });
    assert.equal((html.match(/type="radio"/g) || []).length, 20);
    assert.equal((html.match(/<textarea/g) || []).length, 3);
    assert.equal((html.match(/<fieldset/g) || []).length, 7);
    assert.match(html, /maxlength="5000"/i);
    assert.match(html, /Submit Survey/);
});

test("survey loading and fetch failure provide feedback and retry", () => {
    assert.match(render(Survey), /Loading survey/);
    const html = render(Survey, { rewardChallengeSurveys: { 12: { error: { message: "Network unavailable" } } } });
    assert.match(html, /Network unavailable/);
    assert.match(html, /Retry/);
    assert.doesNotMatch(html, /Submit Survey/);
});

test("unavailable and already completed surveys never display an answer form", () => {
    const unavailable = render(Survey, { rewardChallengeSurveys: { 12: { data: { ...survey, can_submit: false } } } });
    assert.match(unavailable, /not available yet/);
    assert.doesNotMatch(unavailable, /<textarea/);
    const completed = render(Survey, { rewardChallengeSurveys: { 12: { data: { ...survey, user_has_responded: true } } } });
    assert.match(completed, /do not need to answer again/);
    assert.doesNotMatch(completed, /Submit Survey/);
});

test("pending submission disables controls and shows visible loading", () => {
    const html = render(Survey, { rewardChallengeSurveys: { 12: { data: survey, submitting: true } } });
    assert.equal((html.match(/<fieldset disabled/g) || []).length, 7);
    assert.match(html, /LOADING/);
    assert.match(html, /aria-busy="true"/);
});

test("saved survey remains complete when the points refresh fails", () => {
    const html = render(Survey, {
        rewardChallengeSurveys: { 12: { data: { ...survey, user_has_responded: true } } },
        challengeProfileSummaryError: { message: "Network unavailable" },
    });
    assert.match(html, /Your survey is saved/);
    assert.match(html, /Refresh points/);
    assert.doesNotMatch(html, /Submit Survey/);
});

test("approved proof pending survey is not described as waiting for proof review", () => {
    const html = render(Submitted, {}, { challenge: { ...challenge, proof_approved_at: "2026-10-12", participation_status: "pending_survey" } });
    assert.match(html, /Your proof is approved/);
    assert.doesNotMatch(html, /waiting for admin review/);
});

test("daily proof progress does not claim final completion before survey", () => {
    const html = render(Progress, {}, { currentStep: 2, challenge: { ...challenge, is_daily_challenge: true, required_days: 2, completed_days: 2, participation_status: "pending_survey" } });
    assert.match(html, /Day 2 of 2 approved/);
    assert.match(html, /completion also requires the survey/);
    assert.doesNotMatch(html, /Challenge complete!/);
});

test("approved challenge distinguishes challenge reward from survey and total", () => {
    const html = render(Approved, {}, { challenge: { ...challenge, ...completion } });
    assert.match(html, /100 pts/);
    assert.match(html, /15 survey points awarded separately/);
    assert.match(html, /Total earned: 115 points/);
});

test("points history shows survey reward before final approval and bounds rendering", () => {
    const html = render(Profile, { challengeProfileSummary: {
        total_points: 15,
        challenge_history: Array.from({ length: 11 }, (_, index) => ({
            id: index + 1, challenge_title: `Challenge ${index + 1}`, status: "pending_survey",
            points: 100, survey_points_awarded: 15, total_points_awarded: 15,
        })),
    } });
    assert.match(html, /Survey Required/);
    assert.match(html, /\+15 Survey pts/);
    assert.doesNotMatch(html, /100 pts/);
    assert.equal((html.match(/class="border-b border-gray-100 hover:bg-gray-50\/80 transition-colors group"/g) || []).length, 10);
    assert.match(html, /Next/);
});

test("points history labels team points and identifies the challenge", () => {
    const html = render(Profile, { challengeProfileSummary: {
        total_points: 125,
        challenge_history: [{
            id: "team-1",
            challenge_title: "Quarterly Team Challenge",
            category: "Teamwork",
            submission_type: "team",
            status: "approved",
            challenge_points_awarded: 100,
            bonus_points_awarded: 25,
            team_points_awarded: 125,
            survey_points_awarded: 0,
            total_points_awarded: 125,
        }],
    } });
    assert.match(html, /Quarterly Team Challenge/);
    assert.match(html, /Team Submission/);
    assert.match(html, /\+100 Team pts/);
    assert.match(html, /\+25 Bonus pts/);
    assert.doesNotMatch(html, /challenge pts/);
    assert.match(html, /lucide-users/);
});

test("points history separates individual challenge and survey rewards", () => {
    const html = render(Profile, { challengeProfileSummary: {
        total_points: 140,
        challenge_history: [{
            id: 1,
            challenge_title: "Individual Wellness Challenge",
            category: "Wellness",
            status: "approved",
            challenge_points_awarded: 100,
            bonus_points_awarded: 25,
            survey_points_awarded: 15,
            total_points_awarded: 140,
        }],
    } });
    assert.match(html, /Individual Wellness Challenge/);
    assert.match(html, /\+100 Challenge pts/);
    assert.match(html, /\+25 Bonus pts/);
    assert.match(html, /\+15 Survey pts/);
    assert.doesNotMatch(html, /\+140 pts/);
});

test("leaderboard separates team submissions and labels each team by its leader", () => {
    const leaderboardState = {
        rewardChallengeParticipantsChallenge: {
            ...challenge,
            participants_count: 2,
        },
        rewardChallengeIndividualParticipants: [{
            id: 1,
            participant_id: 1,
            name: "Individual Entry",
            email: "individual@example.test",
            status: "approved",
            joined_at: "2026-10-10 09:00:00",
            submitted_at: "2026-10-11 09:00:00",
            points_awarded: 125,
            challenge_points_awarded: 100,
            bonus_points_awarded: 25,
            rank: 1,
            is_winner: true,
            winner_count: 2,
        }, {
            id: 2,
            participant_id: 2,
            name: "Second Individual Winner",
            email: "second@example.test",
            status: "approved",
            joined_at: "2026-10-10 09:00:00",
            submitted_at: "2026-10-11 09:00:00",
            points_awarded: 125,
            challenge_points_awarded: 100,
            bonus_points_awarded: 25,
            rank: 1,
            is_winner: true,
            winner_count: 2,
        }],
        rewardChallengeTeamSubmissions: [{
            id: "team-1",
            name: "Team: Team Leader",
            email: "leader@example.test",
            department: "Engineering",
            status: "approved",
            joined_at: "2026-10-10 09:00:00",
            submitted_at: "2026-10-10 10:00:00",
            points_awarded: 125,
            challenge_points_awarded: 100,
            bonus_points_awarded: 25,
            member_count: 2,
            rank: 1,
            is_winner: true,
            winner_count: 1,
        }],
    };
    const teamHtml = render(ParticipantLeaderboard, leaderboardState, {
        submissionType: "team",
    });
    assert.match(teamHtml, /Team Submission Leaderboard/);
    assert.match(teamHtml, /Team: Team Leader/);
    assert.doesNotMatch(teamHtml, /Individual Entry/);

    const individualHtml = render(ParticipantLeaderboard, leaderboardState, {
        submissionType: "individual",
    });
    assert.match(individualHtml, /Individual Submission Leaderboard/);
    assert.match(individualHtml, /Individual Entry/);
    assert.doesNotMatch(individualHtml, /Team: Team Leader/);
    assert.match(individualHtml, /Co-winner/);

    const topWinnersHtml = render(TopLeaderboard, leaderboardState, {
        submissionType: "individual",
    });
    assert.match(topWinnersHtml, /Individual Entry/);
    assert.match(topWinnersHtml, /Second Individual Winner/);
    assert.match(topWinnersHtml, /Co-winner/);
    assert.match(topWinnersHtml, /#1/);
    assert.match(topWinnersHtml, /1st Place/);
    assert.match(topWinnersHtml, /aria-label="Rank 1"/);

    const topTeamWinnerHtml = render(TopLeaderboard, leaderboardState, {
        submissionType: "team",
    });
    assert.match(topTeamWinnerHtml, /Team: Team Leader/);
    assert.match(topTeamWinnerHtml, /125 pts/);
    assert.match(topTeamWinnerHtml, />Winner</);
    assert.match(topTeamWinnerHtml, /1st Place/);
    assert.match(topTeamWinnerHtml, /aria-label="Rank 1"/);

    const podiumHtml = render(TopLeaderboard, {
        ...leaderboardState,
        rewardChallengeIndividualParticipants: [
            {
                ...leaderboardState.rewardChallengeIndividualParticipants[0],
                id: 1,
                name: "First Place",
                rank: 1,
                winner_count: 1,
            },
            {
                ...leaderboardState.rewardChallengeIndividualParticipants[0],
                id: 2,
                name: "Second Place",
                rank: 2,
                winner_count: 1,
            },
            {
                ...leaderboardState.rewardChallengeIndividualParticipants[0],
                id: 3,
                name: "Third Place",
                rank: 3,
                winner_count: 1,
            },
        ],
    });
    assert.match(podiumHtml, /1st Place/);
    assert.match(podiumHtml, /2nd Place/);
    assert.match(podiumHtml, /3rd Place/);
});

test("challenge participants slice prefers the pre-ranked response for each submission type", () => {
    const action = thunks.get_engagement_reward_challenge_participants_thunk.fulfilled(
        {
            data: {
                participants: [{ name: "Legacy Entry" }],
                individual_participants: [{ name: "Legacy Individual" }],
                team_submissions: [{ name: "Legacy Team" }],
                individual_leaderboard: [{ name: "Ranked Individual" }],
                team_leaderboard: [{ name: "Ranked Team" }],
            },
        },
        "request-id",
        12,
    );
    const state = slice.default(undefined, action);

    assert.deepEqual(state.rewardChallengeIndividualParticipants, [
        { name: "Ranked Individual" },
    ]);
    assert.deepEqual(state.rewardChallengeTeamSubmissions, [
        { name: "Ranked Team" },
    ]);
    assert.deepEqual(state.rewardChallengeParticipants, [
        { name: "Legacy Entry" },
    ]);
});

test("proof review defines non-negative bonus validation and previews base, bonus, and total points", () => {
    const source = readFileSync(path.join(
        root,
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/proof-section.jsx",
    ), "utf8");

    assert.match(source, /label="Bonus Points"/);
    assert.match(source, /min="0"/);
    assert.match(source, /if \(!submission\)[\s\S]*setBonusPoints\("0"\)/);
    assert.match(source, /if \(!submission\)[\s\S]*setBonusError\(""\)/);
    assert.match(source, /Number\.isInteger\(parsedBonusPoints\)/);
    assert.match(source, /parsedBonusPoints >= 0/);
    assert.match(source, /onApprove\(activeSubmission, parsedBonusPoints\)/);
    assert.match(source, /Challenge Points/);
    assert.match(source, /basePoints \+ parsedBonusPoints/);
    assert.match(source, /Team challenge and bonus points are awarded to the leader only/);
});

test("pending survey card remains actionable even after the deadline", () => {
    const html = render(Cards, {}, { challenges: [{ ...challenge, status: "Completed", participation_status: "pending_survey", can_complete_survey: true }] });
    assert.match(html, /Complete Survey/);
    assert.match(html, /Survey Required/);
    assert.doesNotMatch(html, /Challenge Ended/);
});

test("upcoming cards never show the survey action even with stale eligibility", () => {
    const html = render(Cards, {}, { challenges: [{ ...challenge, status: "Upcoming", start_date: "2026-10-13", can_complete_survey: true }] });
    assert.match(html, /Starts/);
    assert.doesNotMatch(html, /Complete Survey/);
});

test("survey reward blocks the leave button after proof rejection", () => {
    const html = render(Cards, {}, { challenges: [{ ...challenge, participation_status: "declined", survey_completed: true, survey_points_awarded: 15 }] });
    assert.match(html, /Resubmit Proof/);
    assert.match(html, /<button[^>]+disabled=""[^>]*>Leave<\/button>/);
});

test("legacy challenges retain pending review without a survey action", () => {
    const html = render(Cards, {}, { challenges: [{ ...challenge, survey_required: false }] });
    assert.match(html, /Pending Review/);
    assert.doesNotMatch(html, /Complete Survey/);
});

test("profile load failures are not presented as an empty successful history", () => {
    const html = render(Profile, { challengeProfileSummaryError: { message: "Network unavailable" } });
    assert.match(html, /Network unavailable/);
    assert.match(html, /Challenge history could not be loaded/);
    assert.doesNotMatch(html, /No challenge history found/);
});

test("Post Event Survey rows identify challenge ID, title and category without mutation or copy actions", () => {
    globalThis.window = { location: { pathname: "/accounts/administrator/activities/post_event_survey" } };
    const survey = {
        id: 37, reward_challenge_id: 12, title: "Challenge Survey", status: "published",
        challenge: { id: 12, title: "Wellness Challenge", category: "Wellness", start_date: "2026-10-12" },
    };
    const [row] = SurveyTable.buildRows([survey], null, true);
    assert.match(renderToStaticMarkup(row.event_id), /CH-12/);
    assert.match(renderToStaticMarkup(row.event), /Wellness Challenge/);
    assert.match(renderToStaticMarkup(row.category), /Challenge/);
    assert.equal(row.actions, null);
    const surveyCell = renderToStaticMarkup(row.survey);
    assert.match(surveyCell, /Open Survey/);
    assert.doesNotMatch(surveyCell, /Copy Link/);
    assert.equal(SurveyTable.buildRows([{ id: 1, event: { category: "Other" } }], null, true).length, 0);
    const [eventRow] = SurveyTable.buildRows([{
        id: 1, title: "Event Survey", status: "published",
        event: { headline: "Company Day", category: "Event" },
    }], null, true);
    assert.match(renderToStaticMarkup(eventRow.event_id), /SID-01/);
    assert.match(renderToStaticMarkup(eventRow.survey), /Copy Link/);
    assert.notEqual(eventRow.actions, null);
});

test("Post Event Survey detail is read-only for challenge surveys", async () => {
    globalThis.window = {
        location: { pathname: "/accounts/administrator/activities/post_event_survey/37" },
        navigator: { userAgent: "node-test" },
        history: { scrollRestoration: "auto" },
    };
    const Header = (await load("resources/js/app/pages/accounts/_administrator/activities/post_event_survey/id/sections/header-section.jsx")).default;
    const state = configureStore({
        reducer: {
            engagement: slice.default,
            post_event_surveys: postEventSlice.default,
            app: (current = { data: { user: { account_employee: { department_id: 1 } } } }) => current,
        },
    });
    state.dispatch(postEventSlice.get_post_event_survey_thunk.fulfilled({
        data: { id: 37, reward_challenge_id: 12, status: "published" },
    }, "survey-header-test", 37));
    const html = renderToStaticMarkup(React.createElement(Provider, { store: state },
        React.createElement(Header, { surveyId: 37 })));
    assert.match(html, /Survey Details/);
    assert.doesNotMatch(html, /Close Survey|Reopen Survey/);
});

test("Submissions table renders survey completed/pending and legacy not-applicable states", () => {
    const row = (id, surveyRequired, surveyCompleted) => ({
        id: String(id), status: "submitted", submitted_at: "2026-10-12",
        survey_completed: surveyCompleted,
        challenge: { title: "Wellness", points: 100, survey_required: surveyRequired },
        employee: { id, name: "Test Employee", email: "test@example.test" },
    });
    const state = store();
    state.dispatch({ type: "engagement/test", payload: null });
    const rows = [row(1, true, true), row(2, true, false), row(3, false, false)];
    state.dispatch({ type: "replaceSubmissions", payload: rows });
    state.replaceReducer((root) => ({
        ...root,
        engagement: { ...root.engagement, challengeSubmissions: rows, challengeSubmissionsLoading: false },
    }));
    const html = renderToStaticMarkup(React.createElement(Provider, { store: state },
        React.createElement(SubmissionTable, { filters: {} })));
    assert.match(html, />Survey</);
    assert.match(html, />Completed</);
    assert.match(html, />Pending</);
    assert.match(html, /—/);
});

test("submissions table limits each active type to ten rows and renders its pager", () => {
    const submissions = Array.from({ length: 12 }, (_, index) => ({
        id: `individual-${index + 1}`,
        status: "submitted",
        submitted_at: "2026-10-12",
        challenge: { title: "Wellness", points: 100, survey_required: false },
        employee: {
            id: index + 1,
            name: `Export Employee ${index + 1}`,
            email: `employee-${index + 1}@example.test`,
        },
    }));
    const html = render(SubmissionTable, {
        challengeSubmissions: submissions,
        challengeSubmissionsLoading: false,
    }, {
        filters: {},
        submissionType: "individual",
        setSubmissionType() {},
    });

    for (let index = 1; index <= 10; index++) {
        assert.match(html, new RegExp(`Export Employee ${index}`));
    }
    assert.doesNotMatch(html, /Export Employee 11/);
    assert.match(html, /Next/);

    const paginationHtml = render(SubmissionPagination, {}, {
        data: { current_page: 2, last_page: 2 },
        onPageChange() {},
    });
    assert.match(paginationHtml, /Previous/);
    assert.doesNotMatch(paginationHtml, /Next/);
    assert.match(paginationHtml, />2</);

    const singlePageHtml = render(SubmissionPagination, {}, {
        data: { current_page: 1, last_page: 1 },
        onPageChange() {},
    });
    assert.match(singlePageHtml, /<nav/);
    assert.match(singlePageHtml, />1</);
    assert.doesNotMatch(singlePageHtml, /Previous|Next/);
});

test("Submissions table points use the leaderboard total and base-plus-bonus hierarchy", () => {
    const html = render(SubmissionTable, {
        challengeSubmissionsLoading: false,
        challengeSubmissions: [
            {
                id: "approved",
                status: "approved",
                points_awarded: 125,
                challenge_points_awarded: 100,
                bonus_points_awarded: 25,
                submitted_at: "2026-10-12",
                challenge: { title: "Approved Challenge", points: 100 },
                employee: { name: "Approved Employee", email: "approved@example.test" },
            },
            {
                id: "pending-survey",
                status: "approved",
                participation_status: "pending_survey",
                bonus_points: 25,
                submitted_at: "2026-10-12",
                challenge: { title: "Survey Challenge", points: 100 },
                employee: { name: "Survey Employee", email: "survey@example.test" },
            },
            {
                id: "pending",
                status: "submitted",
                submitted_at: "2026-10-12",
                challenge: { title: "Pending Challenge", points: 100 },
                employee: { name: "Pending Employee", email: "pending@example.test" },
            },
            {
                id: "daily",
                status: "approved",
                individual_daily_log: true,
                bonus_points: 10,
                submitted_at: "2026-10-12",
                challenge: { title: "Daily Challenge", points: 100 },
                employee: { name: "Daily Employee", email: "daily@example.test" },
            },
        ],
    }, { filters: {} });

    assert.match(html, /text-sm font-semibold text-green-600[^>]*>\+125</);
    assert.match(html, /100 base \+ 25 bonus/);
    assert.match(html, /pending survey/);
    assert.match(html, /100 base \+ bonus on approval/);
    assert.match(html, /10 bonus approved/);
    assert.match(html, /base points on completion/);

    const source = readFileSync(path.join(
        root,
        "resources/js/app/pages/accounts/_administrator/rnr/challenges_events/submissions/sections/table-section.jsx",
    ), "utf8");
    assert.match(source, /const isTeam = submission\.employees\?\.length > 0/);
    assert.match(source, /Awarded to leader only/);
});
