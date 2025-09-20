import redisService from "./index.js";
import { logger } from "../../utilities/logger.js";

class PubSubService {
  constructor() {
    this.publisher = null;
    this.subscriber = null;
    this.subscribers = new Map();
  }

  getPublisher() {
    if (!this.publisher) {
      this.publisher = redisService.getClient("pubsub");
    }
    return this.publisher;
  }

  getSubscriber() {
    if (!this.subscriber) {
      this.subscriber = redisService.getClient("pubsub");
    }
    return this.subscriber;
  }

  async publish(channel, message) {
    try {
      const publisher = this.getPublisher();
      if (!publisher) return false;

      const serializedMessage = JSON.stringify(message);
      await publisher.publish(channel, serializedMessage);
      return true;
    } catch (error) {
      logger.error("Publish error:", error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    try {
      const subscriber = this.getSubscriber();
      if (!subscriber) return false;

      // Store callback for this channel
      this.subscribers.set(channel, callback);

      await subscriber.subscribe(channel, (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logger.error("Message parsing error:", error);
          callback(message); // Send raw message if parsing fails
        }
      });

      return true;
    } catch (error) {
      logger.error("Subscribe error:", error);
      return false;
    }
  }

  async unsubscribe(channel) {
    try {
      const subscriber = this.getSubscriber();
      if (!subscriber) return false;

      await subscriber.unsubscribe(channel);
      this.subscribers.delete(channel);
      return true;
    } catch (error) {
      logger.error("Unsubscribe error:", error);
      return false;
    }
  }
}

export default new PubSubService();
