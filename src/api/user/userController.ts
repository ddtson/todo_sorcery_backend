import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

import { userService } from '@/api/user/userService';

interface UserRoute extends RouteGenericInterface {
  Params: {
    id: string;
  };
}

class UserController {
  public getUsers = async (_req: FastifyRequest<UserRoute>, res: FastifyReply<UserRoute>) => {
    const serviceResponse = await userService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getUser = async (req: FastifyRequest<UserRoute>, res: FastifyReply<UserRoute>) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const userController = new UserController();
