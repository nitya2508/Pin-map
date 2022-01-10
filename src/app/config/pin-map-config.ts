export default {
    oidc: {
        issuer: 'https://dev-59075937.okta.com/oauth2/default',
        clientId: '0oa3iccbzmRdZclI05d7',
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email'],
        pkce: true,
    }
}