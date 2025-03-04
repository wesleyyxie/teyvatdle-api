import { Express } from "express";
import { getNamesList } from "../src/handlers/splash";
import characterInfo from "../assets/data/characterInfo.json";
import abilities from "../assets/data/abilities.json";
import voicelines from "../assets/data/voicelines.json";

const app: Express = require("../src");
const request = require("supertest");

// Test utilities
const testUtils = {
  checkEqualJSON: (response: any, json: any) => {
    expect(response.status).toBe(200);
    expect(response.body).toEqual(json);
  },

  checkHasFormat: (response: any, format: string) => {
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(format);
    expect(response.body).toBeInstanceOf(Buffer);
  },

  checkHasError: (response: any, errorMessage: string) => {
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(errorMessage);
  },
};

describe("Genshin API", () => {
  // Characters endpoints
  describe("Characters", () => {
    describe("GET /characters", () => {
      it("should return all characters", async () => {
        const response = await request(app).get("/characters");
        testUtils.checkEqualJSON(response, characterInfo);
      });
    });

    describe("GET /characters/:characterName", () => {
      it("should return the character information for valid character", async () => {
        const response = await request(app).get("/characters/albedo");
        testUtils.checkEqualJSON(response, characterInfo.albedo);
      });

      it("should return error for non-existent character", async () => {
        const response = await request(app).get("/characters/albedooo");
        testUtils.checkHasError(response, "Character not found");
      });
    });

    describe("GET /characters/:characterName/:item", () => {
      it("should return character icon as PNG", async () => {
        const response = await request(app).get("/characters/albedo/icon");
        testUtils.checkHasFormat(response, "image/png");
      });

      it("should return error for invalid item", async () => {
        const response = await request(app).get("/characters/albedo/fffff");
        testUtils.checkHasError(response, "Item not found, use 'icon'");
      });
    });
  });

  // Voicelines endpoints
  describe("Voicelines", () => {
    describe("GET /voicelines", () => {
      it("should return all voicelines", async () => {
        const response = await request(app).get("/voicelines");
        testUtils.checkEqualJSON(response, voicelines);
      });
    });

    describe("GET /voicelines/:characterName", () => {
      it("should return all voicelines for valid character", async () => {
        const response = await request(app).get("/voicelines/hu tao");
        testUtils.checkEqualJSON(response, voicelines["hu tao"]);
      });

      it("should return error for non-existent character", async () => {
        const response = await request(app).get("/voicelines/hu taoo");
        testUtils.checkHasError(response, "Character not found");
      });
    });

    describe("GET /voicelines/:characterName/:id", () => {
      it("should return specific voiceline for valid id", async () => {
        const response = await request(app).get("/voicelines/hu tao/1");
        testUtils.checkEqualJSON(response, voicelines["hu tao"][1]);
      });

      it("should return error for invalid id", async () => {
        const response = await request(app).get("/voicelines/hu tao/5");
        testUtils.checkHasError(
          response,
          "Voiceline Id needs to be a number between 0 and 3"
        );
      });
    });

    describe("GET /voicelines/:characterName/:id/:audio", () => {
      it("should return voiceline audio for valid parameters", async () => {
        const response = await request(app).get("/voicelines/hu tao/1/audio");
        testUtils.checkHasFormat(response, "audio/wav");
      });

      it("should return error for invalid audio parameter", async () => {
        const response = await request(app).get("/voicelines/hu tao/3/audioo");
        testUtils.checkHasError(response, "Item not found. Please use 'audio'");
      });
    });
  });

  // Abilities endpoints
  describe("Abilities", () => {
    describe("GET /abilities", () => {
      it("should return all abilities", async () => {
        const response = await request(app).get("/abilities");
        testUtils.checkEqualJSON(response, abilities);
      });
    });

    describe("GET /abilities/:characterName", () => {
      it("should return all abilities for valid character", async () => {
        const response = await request(app).get("/abilities/beidou");
        testUtils.checkEqualJSON(response, abilities.beidou);
      });

      it("should return error for non-existent character", async () => {
        const response = await request(app).get("/abilities/beidouu");
        testUtils.checkHasError(response, "Character not found");
      });
    });

    describe("GET /abilities/:characterName/:type", () => {
      it("should return burst ability for valid character", async () => {
        const response = await request(app).get("/abilities/beidou/burst");
        testUtils.checkEqualJSON(response, abilities.beidou.burst);
      });

      it("should return skill ability for valid character", async () => {
        const response = await request(app).get("/abilities/beidou/skill");
        testUtils.checkEqualJSON(response, abilities.beidou.skill);
      });

      it("should return error for invalid ability type", async () => {
        const response = await request(app).get("/abilities/beidou/burstt");
        testUtils.checkHasError(
          response,
          "Invalid ability type, use 'burst' or 'skill'"
        );
      });
    });

    describe("GET /abilities/:characterName/:type/:icon", () => {
      it("should return ability icon as PNG", async () => {
        const response = await request(app).get("/abilities/beidou/burst/icon");
        testUtils.checkHasFormat(response, "image/png");
      });

      it("should return error for invalid icon parameter", async () => {
        const response = await request(app).get(
          "/abilities/beidou/burst/iconn"
        );
        testUtils.checkHasError(
          response,
          "Item not found, use 'icon' in url path"
        );
      });
    });
  });

  // Splash endpoints
  describe("Splash", () => {
    describe("GET /splash", () => {
      it("should return all character names", async () => {
        const response = await request(app).get("/splash");
        testUtils.checkEqualJSON(response, {
          availableSplashes: getNamesList(),
        });
      });
    });

    describe("GET /splash/:characterName", () => {
      it("should return splash image for valid character", async () => {
        const response = await request(app).get("/splash/razor");
        testUtils.checkHasFormat(response, "image/png");
      });

      it("should return error for non-existent character", async () => {
        const response = await request(app).get("/splash/razorrr");
        testUtils.checkHasError(response, "Character not found");
      });
    });

    describe("GET /splash/:characterName/:pixelatedId", () => {
      it("should return pixelated image for valid id", async () => {
        const response = await request(app).get("/splash/razor/1");
        testUtils.checkHasFormat(response, "image/png");
      });

      it("should return error for invalid pixelated id", async () => {
        const response = await request(app).get("/splash/razor/5");
        testUtils.checkHasError(
          response,
          "Pixelated images need an id from 1 to 4"
        );
      });
    });
  });

  // Answers endpoints
  describe("Answers", () => {
    describe("GET /answers", () => {
      it("should return JSON response", async () => {
        const response = await request(app).get("/answers");
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
      });
    });

    describe("GET /answers/:gamemode", () => {
      it("should return JSON for valid gamemode", async () => {
        const response = await request(app).get("/answers/classic");
        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
      });

      it("should return error for invalid gamemode", async () => {
        const response = await request(app).get("/answers/classicc");
        testUtils.checkHasError(
          response,
          "Invalid gamemode. Please use 'classic', 'voicelines', 'abilities', or 'spy'."
        );
      });
    });
  });
});
