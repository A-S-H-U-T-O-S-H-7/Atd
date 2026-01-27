import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/lib/firebase';
import { UI_TO_DB_MAPPING,FIREBASE_FOLDERS  } from "../documentMappings";

export const fileService = {
  // Get Firebase folder for a document
  getFolderForDocument: (dbFieldName) => {
    const folder = FIREBASE_FOLDERS[dbFieldName];
    if (!folder) {
      throw new Error(`No folder mapping found for document: ${dbFieldName}`);
    }
    return folder;
  },

  // Get DB field name from UI field
  getDbFieldName: (uiFieldName) => {
    const dbField = UI_TO_DB_MAPPING[uiFieldName];
    if (!dbField) {
      throw new Error(`No mapping found for UI field: ${uiFieldName}`);
    }
    return dbField;
  },

  // View file
  viewFile: async (fileName, documentIdentifier) => {
    if (!fileName) {
      throw new Error('No file available');
    }

    // Handle both DB field names and UI field names
    let dbFieldName;
    if (UI_TO_DB_MAPPING[documentIdentifier]) {
      // If it's a UI field name, convert to DB field
      dbFieldName = UI_TO_DB_MAPPING[documentIdentifier];
    } else if (FIREBASE_FOLDERS[documentIdentifier]) {
      dbFieldName = documentIdentifier;
    } else {
      throw new Error(`Invalid document identifier: ${documentIdentifier}`);
    }

    const folder = FIREBASE_FOLDERS[dbFieldName];
    if (!folder) {
      throw new Error(`Document type '${dbFieldName}' not configured`);
    }
    
    const filePath = `${folder}/${fileName}`;
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    
    return url;
  },

  // Upload file
  uploadFile: async (file, dbFieldName) => {
    try {
      const folder = FIREBASE_FOLDERS[dbFieldName];
      if (!folder) throw new Error(`Folder mapping not found for: ${dbFieldName}`);

      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { fileName, downloadURL, filePath };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Upload from UI field name
  uploadFileFromUI: async (file, uiFieldName) => {
    const dbFieldName = UI_TO_DB_MAPPING[uiFieldName];
    if (!dbFieldName) {
      throw new Error(`Invalid UI field name: ${uiFieldName}`);
    }
    return await fileService.uploadFile(file, dbFieldName);
  }
};

export default fileService;