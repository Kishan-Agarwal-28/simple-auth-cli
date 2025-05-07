"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserRedirectUri = void 0;
var simple_oauth2_1 = require("simple-oauth2");
var oauth_secrets_js_1 = require("../oauth.secrets.js");
var generateAuthUri = function (provider, scopes, providerName) {
    var state = '';
    var client = new simple_oauth2_1.AuthorizationCode(provider);
    var authorizationUri = client.authorizeURL({
        redirect_uri: "http://localhost:3000/api/v1/users/auth/oauth/".concat(providerName, "/callback"),
        scope: scopes,
        state: state,
    });
    return authorizationUri;
};
var registerUserRedirectUri = function (provider) {
    var scopes;
    switch (provider) {
        case "google":
            scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
            return generateAuthUri(oauth_secrets_js_1.GoogleClient, scopes, "google");
        case "facebook":
            scopes = ['email'];
            return generateAuthUri(oauth_secrets_js_1.FacebookClient, scopes, "facebook");
        case "github":
            scopes = ['user', 'user:email'];
            return generateAuthUri(oauth_secrets_js_1.GithubClient, scopes, "github");
        case "microsoft":
            scopes = ['User.Read'];
            return generateAuthUri(oauth_secrets_js_1.MicrosoftClient, scopes, "microsoft");
        case "spotify":
            scopes = ['user-read-private', 'user-read-email'];
            return generateAuthUri(oauth_secrets_js_1.SpotifyClient, scopes, "spotify");
        default:
            return undefined;
    }
};
exports.registerUserRedirectUri = registerUserRedirectUri;
