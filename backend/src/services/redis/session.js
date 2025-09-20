import crypto from "crypto";

import redisService from "./index.js";
import { logger } from "../../utilities/logger.js";

class SessionService {
  constructor() {
    this.client = null;
    this.sessionTTL = 86400; // 24 hours
  }

  getClient() {
    if (!this.client) {
      this.client = redisService.getClient("session");
    }
    return this.client;
  }

  async createSession(userId, data) {
    try {
      const client = this.getClient();
      if (!client) return null;

      const sessionId = `sess:${userId}:${crypto.randomUUID()}`;
      const session = {
        userId,
        createdAt: new Date().toISOString(),
        ...dada,
      };

      await client.setEx(sessionId, this.sessionTTL, JSON.stringify(session));
      return sessionId;
    } catch (error) {
      logger.error("Session creation error:", error);
      return null;
    }
  }

  async getSession(sessionId) {
    try {
      const client = this.getClient();
      if (!client) return null;

      const session = await client.get(sessionId);
      return session ? JSON.parse(session) : null;
    } catch (error) {
      logger.error("Session get error:", error);
      return null;
    }
  }

  async updateSession(sessionId, data) {
    try {
      const client = this.getClient();
      if (!client) return false;

      const existingSession = await this.getSession(sessionId);
      if (!existingSession) return false;

      const updatedSession = {
        ...existingSession,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await client.setEx(
        sessionId,
        this.sessionTTL,
        JSON.stringify(updatedSession)
      );
      return true;
    } catch (error) {
      logger.error("Session update error:", error);
      return false;
    }
  }

  async destroySession(sessionId) {
    try {
      const client = this.getClient();
      if (!client) return false;

      await client.del(sessionId);
      return true;
    } catch (error) {
      logger.error("Session destroy error:", error);
      return false;
    }
  }
}

export default new SessionService();
