/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2021*/
/**
 * Auth Service
 * @copyright 2021 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

const { Op } = require('sequelize')

const passwordService = require('./PasswordService')
const mailService = require('./MailService')
const generateCode = require('../utils/generateCode')

const db = require('../models')

const errors = {
  EMAIL_ADDRESS_NOT_FOUND: 'EMAIL_ADDRESS_NOT_FOUND',
  EMAIL_ADDRESS_ALREADY_EXIST: 'EMAIL_ADDRESS_ALREADY_EXIST',
  PASSWORD_NOT_MATCH: 'PASSWORD_NOT_MATCH',
  INVALID_EMAIL_CONFIRMATION_CODE: 'INVALID_EMAIL_CONFIRMATION_CODE',
  INVALID_EMAIL_OR_PASSWORD: 'INVALID_EMAIL_OR_PASSWORD',
  ACCOUNT_ALREADY_VERIFIED: 'ACCOUNT_ALREADY_VERIFIED',
  CODE_DOES_NOT_EXIST: 'CODE_DOES_NOT_EXIST',
}

module.exports = {
  /**
   * Register new user with email and password
   * @name authService.register
   * @param {String} email user new email address
   * @param {String} password user new password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.register(req.body.email, req.body.password)
   */
  register: async function (email, password, role_id, code, user_details = {}) {
    let User
    let Credential

    try {
      const isEmailAddressExist = await db.credential.getByFields({
        email,
      })
      ;``

      if (isEmailAddressExist)
        throw new Error(errors.EMAIL_ADDRESS_ALREADY_EXIST)
      const codeExists = await db.code.getByFields({
        code,
        is_used: { [Op.or]: [0, null] },
        user_id: { [Op.or]: [0, null] },
      })
      if (!codeExists) throw new Error(errors.CODE_DOES_NOT_EXIST)

      const hashedPassword = await passwordService.hash(password)

      User = await db.user.insert(
        { ...user_details, role_id },
        { returnAllFields: true }
      )

      Credential = await db.credential.insert(
        {
          email: email,
          password: hashedPassword,
          user_id: User.id,
          type: 'n',
          verify: 0,
          role_id,
          status: 1,
        },
        { returnAllFields: true }
      )
      await db.code.edit(
        { user_id: User.id, is_used: 1, status: 1 },
        codeExists.id
      )
      return { credential: Credential.id, user: User }
    } catch (error) {
      if (Credential) {
        await db.credential.realDelete(Credential.id)
      }
      if (User) {
        await db.user.realDelete(User.id)
      }

      throw new Error(error.message)
    }
  },
  /**
   * Login user with email and password
   * @name authService.login
   * @param {String} email user email address
   * @param {String} password user password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.login(req.body.email, req.body.password)
   */
  login: async function (email, password, role_id) {
    const isEmailAddressExist = await db.credential.getByFields({
      email,
      status: 1,
      role_id,
      type: 'n',
    })

    if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND)

    const { password: hashedPassword, id, user_id } = isEmailAddressExist

    const user = await db.user.getByFields({
      id: user_id,
      status: 1,
    })

    if (!user) {
      throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND)
    }

    const isPasswordMatch = await passwordService.compareHash(
      password,
      hashedPassword
    )

    if (!isPasswordMatch) throw new Error(errors.INVALID_EMAIL_OR_PASSWORD)

    return { credential: id, user }
  },
  /**
   * Send email and save to database
   * @name authService.forgotPassword
   * @param {String} email user email address
   * @return {Promise.<Void>}
   * @example
   * await authService.forgotPassword(req.body.email)
   */
  forgotPassword: async function (email) {
    try {
      const isEmailAddressExist = await db.credential.getByFields({
        where: {
          email: email,
        },
      })

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND)

      const { user_id } = isEmailAddressExist

      const getUser = await db.user.getByPk(user_id)

      const verificationCode = generateCode(6)

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      })

      const mailTemplate = await mailService.template('reset-password')

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${getUser.first_name} ${getUser.last_name}`,
          verification_code: verificationCode,
        }
      )

      await mailService.send(injectedMailTemplate)

      await db.token.insert({ token: verificationCode, user_id })
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
   * Verify forgot password confirmation code
   * @name authService.verifyForgotPassword
   * @param {code} code confirmation code
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.verifyForgotPassword(req.body.code)
   */
  verifyForgotPassword: async function (code) {
    try {
      const Token = await db.token.findOne({
        where: {
          token: code,
        },
      })

      const Credential = await db.credential.getByFields({
        user_id: Token.user_id,
      })

      return { credential: Credential.id, user: Credential.user_id }
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
   * Reset password
   * @name authService.resetPassword
   * @param {String} password user new password
   * @param {String} credential_id user credential id
   * @example
   * await authService.resetPassword(req.body.password, credential_id)
   */
  resetPassword: async function (password, credential_id) {
    try {
      const hashedPassword = await passwordService.hash(password)

      await db.credential.edit(
        {
          password: hashedPassword,
        },
        credential_id
      )
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
   * Email confirmation
   * @name authService.emailConfirmation
   * @param {String} email user email address
   * @example
   * await authService.emailConfirmation(email)
   */
  emailConfirmation: async function (email) {
    try {
      const isEmailAddressExist = await db.credential.getByFields({
        where: {
          email: email,
        },
      })

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND)

      const { user_id } = isEmailAddressExist

      const getUser = await db.user.getByPk(user_id)

      const confirmationCode = generateCode(6)

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      })

      const mailTemplate = await mailService.template('email-confirmation')

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${getUser.first_name} ${getUser.last_name}`,
          confirmation_code: confirmationCode,
        }
      )

      await mailService.send(injectedMailTemplate)

      await db.token.insert({ token: confirmationCode, user_id, type: 6 })
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
   * Verify Email address
   * @name authService.emailVerify
   * @param {String} token email confirmation code
   * @param {string} user_id user id
   * @example
   * await authService.emailVerify(email, user_id)
   */
  emailVerify: async function (token, user_id) {
    try {
      const isTokenExist = await db.token.getByFields({
        where: {
          user_id,
          token,
          type: 6,
        },
      })

      if (!isTokenExist) throw new Error(errors.INVALID_EMAIL_CONFIRMATION_CODE)

      await db.token.realDelete(isTokenExist.id)
    } catch (error) {
      throw new Error(error)
    }
  },
  /**
   * check if user need to change password before logging in
   * @name authService.forcePasswordChange
   * @param {string} user_id user id
   */
  forcePasswordChange: async function (user_id) {
    try {
      const { profile_id } = await db.user.getByPk(user_id)
      const { force_password_change } = await db.profile.getByPk(profile_id)

      if (force_password_change) return true
      else return false
    } catch (error) {
      throw new Error(error)
    }
  },
  verifyAccount: async ({ email, roleId }) => {
    const credential = await db.credential.getByFields({
      email,
      status: 1,
      role_id: roleId,
    })

    if (!credential) {
      throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND)
    }

    if (
      credential.type !== 'n' ||
      (credential.type === 'n' && credential.verify)
    ) {
      throw new Error(errors.ACCOUNT_ALREADY_VERIFIED)
    }

    mailService.initialize({
      hostname: process.env.EMAIL_SMTP_SMTP_HOST,
      port: process.env.EMAIL_SMTP_SMTP_PORT,
      username: process.env.EMAIL_SMTP_SMTP_USER,
      password: process.env.EMAIL_SMTP_SMTP_PASS,
      from: process.env.MAIL_FROM,
      to: email,
    })

    const accountConfirmationMailTemplate = await mailService.template(
      'verify-account'
    )

    const token = Buffer.from(JSON.stringify(credential.id))?.toString('base64')

    const BASE_URL = process.env.BASE_URL
    const link =
      (BASE_URL?.endsWith('/') ? BASE_URL?.slice(0, -1) : BASE_URL) +
      '/member/verify-account/' +
      token

    const accountConfirmationMailTemplateFinal = mailService.inject(
      {
        body: accountConfirmationMailTemplate.html,
        subject: accountConfirmationMailTemplate.subject,
      },
      {
        email,
        link,
      }
    )

    await mailService.send(accountConfirmationMailTemplateFinal)
  },
}
