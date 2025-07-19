import { Request } from 'express';
export class GetToken {
  extractTokenFromHeader(req: Request) {
    const auth = req.headers.authorization;
    if (!auth) return null;
    const token = auth.split(' ')[1];
    return token || null;
  }
}
