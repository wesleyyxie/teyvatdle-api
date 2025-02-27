import express, { Express, Request, Response } from "express";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref } from "firebase/storage"

import characterInfo from '../assets/data/characterInfo.json'
import abilities from '../assets/data/abilities.json'
import voicelines from '../assets/data/voicelines.json'
import { abort } from "process";


const app : Express = express();

const firebaseConfig = {
    apiKey: "AIzaSyBkfUTPMnUP7tFz7dQmLRbs8-xjskMJZ5M",
    authDomain: "teyvatdle-api.firebaseapp.com",
    projectId: "teyvatdle-api",
    storageBucket: "teyvatdle-api.firebasestorage.app",
    messagingSenderId: "409440288658",
    appId: "1:409440288658:web:863975c5b015cf3dfc8b4b",
    measurementId: "G-D1CF1GCZZ6",
}
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage();

function getImage(url : string, res : Response, fileType : string) {
    const imageRef = ref(storage, url)
    getDownloadURL(imageRef)
    .then(url => fetch(url))
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => {
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader("Content-Type", fileType); // Change if needed (e.g., image/png)
        res.send(buffer);
    });
}

app.get("/charactersInfo/:characterName?/:imageType?/:pixelatedId?", (req: Request, res: Response) => {
    const { characterName, imageType, pixelatedId } = req.params;
    
    // If no character provided, return all character info
    if (!characterName) {
      res.send(characterInfo);
      return
    }
    
    // Normalize character name for lookup
    const normalizedName = characterName.toLowerCase().replace(/[-_]/g, " ");
    
    // Check if character exists
    const character = characterInfo[normalizedName as keyof typeof characterInfo];
    if (!character) {
      res.status(404).json({ error: "Character not found" });
      return 
    }
    else if (!imageType) {
      res.send(character);
      return 
    }
    else if (imageType != "icon" && imageType != "splash" && imageType != "pixelated") {
        res.status(400).json({ error: "Invalid image type" });
        return
    }
    else {
      // Normalize character name for file path
      const fileCharacterName = characterName.toLowerCase().replace(/[ -]/g, "_");
      let url = "";
      
      // Determine image URL based on imageType
      if (imageType === "icon") {
        url = `/images/character_icons/${fileCharacterName}.png`;
      } 
      else if (imageType === "splash") {
        url = `/images/character_splashes/non-pixelated/${fileCharacterName}_splash.png`;
      } 
      else if (imageType === "pixelated") {
        // Validate pixelated ID
        if (!pixelatedId || isNaN(parseInt(pixelatedId)) || parseInt(pixelatedId) < 1 || parseInt(pixelatedId) > 4) {
          res.status(400).json({ error: "Pixelated images need an id from 1 to 4" });
          return 
        }
        url = `/images/character_splashes/pixelated/${fileCharacterName}_splash_pixelated_${pixelatedId}.png`;
      } 
      getImage(url, res, "image/png")
      return
    }
  });

app.get("/voicelines/:characterName?/:id?/:audio?", (req : Request, res : Response) => {
    const { characterName } = req.params;
    const { id } = req.params
    const { audio } = req.params

    if (!characterName) {
        res.send(voicelines)
        return
    }

    let voicelinesCharacter = voicelines[characterName.toLowerCase().replace(/(-)|(_)/, " ") as keyof typeof voicelines]
    if (!voicelinesCharacter) {
        res.status(404).json({error: "Character not found"})
        return
    }
    else if (!id) {
        res.send(voicelinesCharacter)
        return
    }
    else if (isNaN(parseInt(id)) || parseInt(id) < 0 || parseInt(id) > 3) {
        res.status(404).json({error: "Voiceline Id needs to be a number between 0 and 3"})
        return
    }
    else if (!audio) {
        res.send(voicelinesCharacter[id as keyof typeof voicelinesCharacter])
        return
    }
    else if (audio != "audio") {
        res.status(404).json({error: "Item not found"})
        return
    }
    else{
        const url = `/audios/${characterName.toLowerCase().replace(/( )|(-)/, "_")}${id}.wav`
        getImage(url, res, "audio/wav")
        return
    }
})



app.get("/abilities/:characterName?/:type?/:image?", (req : Request, res : Response) => {
    const { characterName, type, image } = req.params;

    if(!characterName) {
        res.send(abilities)
        return
    }

    let abilitiesCharacter = abilities[characterName.toLowerCase().replace(/(-)|(_)/, " ") as keyof typeof abilities];
    if (!abilitiesCharacter) {
        res.status(404).json({error: "Character not found"})
        return
    }
    else if(abilitiesCharacter && !type) {
        res.send(abilitiesCharacter);
        return
    }
    else if (type != "burst" && type != "skill") {
        res.status(404).json({error: "Invalid type"})
        return
    }
    else if (abilitiesCharacter && !image) {
            res.send(abilitiesCharacter[type as keyof typeof abilitiesCharacter])
            return
    }
    else if (image == "image") {
        let url = `/images/ability_icons/${abilitiesCharacter[type as keyof typeof abilitiesCharacter].name.toLowerCase().replace(/( )|(-)/, "_")}_${type}.png`
        let fileType = "image/png"
        getImage(url, res, fileType)
        return
    }
    res.status(404).json({error: "Item not found"})
});

app.get("/", (req : Request, res : Response) => {
    res.send({
        "categories" : [
            "characters",
            "abilities",
            "voicelines"
        ]
    })
})

module.exports = app