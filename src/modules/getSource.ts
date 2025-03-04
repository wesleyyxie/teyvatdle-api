import { initializeFirebase } from "./initializeFirebase";
import { getDownloadURL, ref } from "firebase/storage";
import { Response } from "express";

/**
 * Retrieves a file from Firebase Storage and sends it as a response
 *
 * @param url - The Firebase Storage reference path
 * @param res - The Express response object
 * @param fileType - The MIME content type of the file
 */
export function getSource(url: string, res: Response, fileType: string) {
  // Initialize Firebase Storage
  const fireBaseStorage = initializeFirebase();

  // Create a reference to the file in Firebase Storage
  const imageRef = ref(fireBaseStorage, url);

  // Retrieve the download URL, fetch the file, and send it as a response
  getDownloadURL(imageRef)
    .then((url) => fetch(url))
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      // Convert ArrayBuffer to Buffer
      const buffer = Buffer.from(arrayBuffer);

      // Set the content type header
      res.setHeader("Content-Type", fileType);

      // Send the file buffer as the response
      res.send(buffer);
    })
    .catch((error) => {
      // Handle any errors in the retrieval process
      console.error("Error retrieving file:", error);
      res.status(500).send("Error retrieving file");
    });
}
