import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";

const firebaseConfig = {
  apiKey: "AIzaSyBoi5thJf-V2TLSSZurzkmNGc7dP_CnKL4",
  authDomain: "consexual-dev.firebaseapp.com",
  projectId: "consexual-dev",
  storageBucket: "consexual-dev.appspot.com",
  messagingSenderId: "308478924855",
  appId: "1:308478924855:web:ec7a2888fc2959b3ec07b2",
};

admin.initializeApp(firebaseConfig);

const generateImageCollectionItem = (collection:string)=>functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const fileDirectory = path.dirname(filePath!);
  const fileName = path.basename(filePath!);

  if (!object.contentType || !object.contentType.startsWith("image/")) {
    return functions.logger.log("This is not an image.");
  }

  if (fileDirectory !== collection) {
    return functions.logger.log("This is not an image collection item");
  }

  try {
    await admin.firestore().collection(collection).doc().set({path: filePath, name: fileName});
    functions.logger.log(`Collection item created correctly at: ${collection}`);
  } catch (e) {
    functions.logger.error(e);
  }
});

const deleteFromImageCollectionItem = (collection:string)=>functions.firestore
    .document(`${collection}/{documentID}`)
    .onDelete(async (snap, context) => {
      // Get an object representing the document prior to deletion
      const deletedValue = snap.data();

      try {
        await admin.storage().bucket().file(deletedValue.path).delete();
        functions.logger.log(`DELETED: The file ${deletedValue.path} was deleted correctly`);
      } catch (e) {
        functions.logger.error(e);
      }
    });

export const generateHairItem = generateImageCollectionItem("hairs");
export const deleteHairFile = deleteFromImageCollectionItem("hairs");
export const generateFaceItem = generateImageCollectionItem("faces");
export const deleteFaceFile = deleteFromImageCollectionItem("faces");

