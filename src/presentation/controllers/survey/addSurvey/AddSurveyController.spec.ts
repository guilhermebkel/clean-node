import MockDate from 'mockdate'
import { HttpRequest, Validation, AddSurvey, AddSurveyParams } from '@/presentation/controllers/survey/addSurvey/AddSurveyControllerProtocols'
import { AddSurveyController } from '@/presentation/controllers/survey/addSurvey/AddSurveyController'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/HttpHelper'
import { throwError } from '@/domain/test'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  const addSurveyStub = new AddSurveyStub()

  return addSurveyStub
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  const validationStub = new ValidationStub()

  return validationStub
}

type SutTypes = {
  validationStub: Validation
  sut: AddSurveyController
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyStub, 'add')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(noContent())
  })
})
