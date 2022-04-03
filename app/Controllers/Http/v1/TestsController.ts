import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UsersController {
  /**
   * @swagger
   * /api/v1/hello:
   *    get:
   *      tags:
   *        - Test
   *      summary: Sample Api
   *      parameters:
   *        - name: name
   *          description: name of user
   *          in: query
   *          required: false
   *          type: string
   *      responses:
   *        200:
   *          description: send hello message
   *          example:
   *            message: Hello Guess 
   */
  public async hello({ request, response }: HttpContextContract) {
    const name = request.input("name", "Guess");
    return response.send({ message: `Hello ` + name });
  }
}
