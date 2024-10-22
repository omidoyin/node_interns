const translation = require('./translation.json')

exports.errors = {
  EMAIL_ADDRESS_NOT_FOUND: translation.xyzAccountDoesntExists,
  EMAIL_ADDRESS_ALREADY_EXIST: translation.xyzAccount_Already_Exists,
  PASSWORD_NOT_MATCH: translation.xyzPasswordsDoNotMatch,
  INVALID_EMAIL_CONFIRMATION_CODE: translation.xyzInvalidEmailConfirmationCode,
  INVALID_EMAIL_OR_PASSWORD: translation.xyzWrongEmailOrPassword,
  ACCOUNT_IS_REGISTERED_WITH_GOOGLE:
    translation.xyzAccountIsRegisteredUsingGoogle,
  ACCOUNT_IS_REGISTERED_WITH_FACEBOOK:
    translation.xyzAccountIsRegisteredUsingFacebook,
  ACCOUNT_IS_REGISTERED_WITH_EMAIL_AND_PASSWORD:
    translation.xyzAccountIsRegisteredUsingEmailAndPassword,
  ACCOUNT_DOES_NOT_EXISTS: translation.xyzAccountDoesntExists,
  CODE_DOES_NOT_EXIST: translation.xyzCodeInvalidOrExpired,
}

exports.errorCodes = {
  token: {
    INVALID_TOKEN: 'INVALID_TOKEN',
  },
  account: {
    ACCOUNT_DOES_NOT_EXISTS: 'ACCOUNT_DOES_NOT_EXISTS',
    ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
    ACCOUNT_ALREADY_VERIFIED: 'ACCOUNT_ALREADY_VERIFIED',
    UNAUTHORIZED: 'UNAUTHORIZED',
  },
  calendar: {
    CALENDAR_EVENT_DOES_NOT_EXISTS: 'CALENDAR_EVENT_DOES_NOT_EXISTS',
  },
  note: {
    NOTE_DOES_NOT_EXISTS: 'NOTE_DOES_NOT_EXISTS',
  },
  extra: {
    CUSTOM_IMAGE_OR_VIDEO_ALREADY_EXISTS:
      'CUSTOM_IMAGE_OR_VIDEO_ALREADY_EXISTS',
    CUSTOM_IMAGE_OR_VIDEO_DOES_NOT_EXISTS:
      'CUSTOM_IMAGE_OR_VIDEO_DOES_NOT_EXISTS',
    INVALID_SYNC_CODE: 'INVALID_SYNC_CODE',
    IFRAME_BLOCKED: 'IFRAME_BLOCKED',
    INVALID_URL: 'INVALID_URL',
    SYNC_CODE_ALREADY_EXISTS: 'SYNC_CODE_ALREADY_EXISTS',
  },
}
