import { initializeFirebase } from "./initializeFirebase";
import { getDownloadURL, ref } from "firebase/storage";
import { Response } from "express";

export function getSource(url: string, res: Response, fileType: string) {
  const fireBaseStorage = initializeFirebase();
  const imageRef = ref(fireBaseStorage, url);
  getDownloadURL(imageRef)
    .then((url) => fetch(url))
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader("Content-Type", fileType); // Change if needed (e.g., image/png)
      res.send(buffer);
    });
}
