import type { WithId } from "mongodb";
import type { TArticles, TUsers } from "../database/types";

const url = "http://localhost:3000"

//at login
type TloginHT = {
  myarticles: string;
  allarticles?: string;
}

type TuserarticleHT = {
  create: string;
  update?: string;
}

function atLogin(user: WithId<TUsers>, sessionid: string): TloginHT {
  const login: TloginHT = {
    myarticles: `${url}/auth/articles/@me?sessionid=${sessionid}`,
  };
  if(user.role === 'admin') {
    login.allarticles = `${url}/auth/articles/all?sessionid=${sessionid}&pageno=1`
  }
  return login;
}

function userArticles(articles: WithId<TArticles>[]): TuserarticleHT {
  const userarticles: TuserarticleHT = {
    create: `${url}/auth/articles/@me/addarticle`
  }
  if(!(articles.length === 0)) {
    userarticles.update = `${url}/auth/articles/@me/updatearticle/<articleid>`
  }
  return userarticles;
}

export { atLogin, userArticles };
