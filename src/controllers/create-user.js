import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest } from './helpers.js'
import { created } from './helpers.js'
import { serverError } from './helpers.js'
import validator from 'validator'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            // validar a requisição (campos obrigatórios, tamanho de senha e email)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().lenght === 0) {
                    return badRequest({
                        message: `Missing param: ${field}`,
                    })
                }
            }

            const passwordIsValid = params.password.length < 6

            if (passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters.',
                })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badRequest({
                    message: 'Invalid e-mail. Please provide a valid one',
                })
            }

            // chamar o UseCase
            const createUserUseCase = new CreateUserUseCase()

            const createdUser = await createUserUseCase.execute(params)

            // retornar a resposta para o usuário em caso de sucesso
            return created(createdUser)

            // retorna 'erro de servidor' em caso de falha de validação das outras camadas
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
