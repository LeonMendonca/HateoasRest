import { nanoid } from "nanoid";
import type { TUsers, Roles } from "../database/types";
import type { ObjectId } from "mongodb";

const sessionMap = new Map<string, TPayload>();
const reverseMap = new Map<string, string>();

type TPayload = {
  _id: ObjectId;
  email: string;
  role: Roles;
}

function createSessionId(payload: TUsers): string {
  const sessionid = nanoid();
  const newPayload: TPayload = {
    _id: payload._id,
    email: payload.email,
    role: payload.role,
  }
  sessionMap.set(sessionid, newPayload);
  reverseMap.set(String(newPayload._id), sessionid);
  console.log("session",sessionMap);
  console.log("reverse",reverseMap);
  return sessionid;
}

function checkSessionId(_id: string): string | undefined {
  const sessionId = reverseMap.get(_id);
  return sessionId;
}

function getPayloadFromSid(sid: string): TPayload | undefined {
  const payload = sessionMap.get(sid);
  return payload; 
}

export { createSessionId, getPayloadFromSid, checkSessionId };
