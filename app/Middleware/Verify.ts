import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Verify {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    const isVerified = auth.user?.isVerified

    if(isVerified) {
      await next()
    } else {
      return response.unauthorized({message: 'belum terverifikasi, silahkan verifikasi otp terlebih dahulu'})
    }
  }
}
