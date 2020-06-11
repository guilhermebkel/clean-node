import { Validation } from '../../protocols/Validation'
import { EmailValidator } from '../../protocols/EmailValidator'
import { InvalidParamError } from '../../errors'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])

    if (!isEmailValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
