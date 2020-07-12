import MockDate from 'mockdate'
import { LoadSurveysRepository, SurveyModel } from '@/data/usecases/survey/LoadSurveys/DbLoadSurveysProtocols'
import { DbLoadSurveys } from '@/data/usecases/survey/LoadSurveys/DbLoadSurveys'
import { throwError } from '@/domain/test'

const makeFakeSurveys = (): SurveyModel[] => ([{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}])

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }

  const loadSurveysRepository = new LoadSurveysRepositoryStub()

  return loadSurveysRepository
}

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepository)

  return {
    sut,
    loadSurveysRepository
  }
}

describe('DBLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    const loadAllSpy = jest.spyOn(loadSurveysRepository, 'loadAll')

    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load()

    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    jest.spyOn(loadSurveysRepository, 'loadAll').mockImplementationOnce(throwError)

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })
})
