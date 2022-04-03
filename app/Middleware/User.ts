import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class User {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const role = auth.user?.role

    if(role == 'user') {
      await next()
    } else {
      return response.unauthorized({ message: 'Hanya user yang bisa booking' })
    }
  }
}
