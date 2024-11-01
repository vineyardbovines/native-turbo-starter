const { RuleTester } = require('eslint');
const { screamingAsConstRule } = require('./screaming-as-const.cjs');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser')
  }
});

ruleTester.run('screaming-as-const', screamingAsConstRule, {
  valid: [
    {
      code: `
        const ValidActions = {
          FetchUser: "FETCH_USER",
          UpdateProfile: "UPDATE_PROFILE",
          DeleteAccount: "DELETE_ACCOUNT"
        } as const;
      `
    },
    {
      code: `
        const HttpStatus = {
          Ok: "OK",
          NotFound: "NOT_FOUND",
          ServerError: "SERVER_ERROR"
        } as const;
      `
    },
    // Test with numbers
    {
      code: `
        const WithNumbers = {
          Error404: "ERROR_404",
          Status500: "STATUS_500"
        } as const;
      `
    }
  ],
  invalid: [
    {
      code: `
        const InvalidActions = {
          FetchUser: "fetchUser",
          UpdateProfile: "Update-Profile",
          DeleteAccount: "delete-account"
        } as const;
      `,
      errors: [
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' }
      ],
      output: `
        const InvalidActions = {
          FetchUser: "FETCH_USER",
          UpdateProfile: "UPDATE_PROFILE",
          DeleteAccount: "DELETE_ACCOUNT"
        } as const;
      `
    },
    {
      code: `
        const WithHyphens = {
          Status: "status-code",
          Error: "error-message",
          Success: "success-result"
        } as const;
      `,
      errors: [
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' }
      ],
      output: `
        const WithHyphens = {
          Status: "STATUS_CODE",
          Error: "ERROR_MESSAGE",
          Success: "SUCCESS_RESULT"
        } as const;
      `
    },
    {
      code: `
        const MixedCases = {
          Status: "StatusCode",
          Error: "ErrorMessage",
          Success: "successResult"
        } as const;
      `,
      errors: [
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' },
        { messageId: 'screamingRequired' }
      ],
      output: `
        const MixedCases = {
          Status: "STATUS_CODE",
          Error: "ERROR_MESSAGE",
          Success: "SUCCESS_RESULT"
        } as const;
      `
    }
  ]
});
