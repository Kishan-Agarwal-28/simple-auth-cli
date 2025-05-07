"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyClient = exports.MicrosoftClient = exports.GithubClient = exports.FacebookClient = exports.GoogleClient = void 0;
var GoogleClient = {
    client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.GOOGLE_TOKEN_HOST,
        authorizePath: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenPath: '/token'
    },
    options: {
        authorizationMethod: 'body',
    },
};
exports.GoogleClient = GoogleClient;
var FacebookClient = {
    client: {
        id: process.env.FACEBOOK_CLIENT_ID,
        secret: process.env.FACEBOOK_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.FACEBOOK_TOKEN_HOST,
        authorizePath: '/',
        tokenPath: ''
    },
    options: {
        authorizationMethod: 'body',
    },
};
exports.FacebookClient = FacebookClient;
var GithubClient = {
    client: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.GITHUB_TOKEN_HOST,
        authorizePath: '/login/oauth/authorize',
        tokenPath: '/login/oauth/access_token'
    },
    options: {
        authorizationMethod: 'body',
    },
};
exports.GithubClient = GithubClient;
var MicrosoftClient = {
    client: {
        id: process.env.MICROSOFT_CLIENT_ID,
        secret: process.env.MICROSOFT_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.MICROSOFT_TOKEN_HOST,
        authorizePath: '/',
        tokenPath: ''
    },
    options: {
        authorizationMethod: 'body',
    },
};
exports.MicrosoftClient = MicrosoftClient;
var SpotifyClient = {
    client: {
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET
    },
    auth: {
        tokenHost: process.env.SPOTIFY_TOKEN_HOST,
        authorizePath: '/authorize',
        tokenPath: 'api/token'
    },
    options: {
        authorizationMethod: 'body',
    },
};
exports.SpotifyClient = SpotifyClient;
