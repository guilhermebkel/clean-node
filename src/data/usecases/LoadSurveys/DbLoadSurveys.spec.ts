import { LoadSurveysRepository } from '../../protocols/db/survey/LoadSurveysRepository'
import { SurveyModel } from '../../../domain/models/Survey'
import { DbLoadSurveys } from './DbLoadSurveys'

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

interface SutTypes {
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
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    const loadSpy = jest.spyOn(loadSurveysRepository, 'loadAll')

    await sut.load()

    expect(loadSpy).toHaveBeenCalled()
  })
})
