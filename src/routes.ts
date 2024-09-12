import { Router } from "express";
import { Controllers } from "./controllers";
import { checkSession } from "./misc/checkSession";
import { errorHandler } from "./customError/errorHandlingMW";

const r = Router();

r.post('/signup', Controllers.createNewUser);

r.post('/login', Controllers.loginExistingUser);

r.get('/articles/all', checkSession, Controllers.getAllArticles);

r.get('/articles/@me', checkSession, Controllers.getUserArticles);

r.post('/articles/@me/addarticle', checkSession, Controllers.createArticle)

r.patch('/articles/@me/updatearticle/:articleid', checkSession, Controllers.patchArticle);

r.use(errorHandler);

export { r };
