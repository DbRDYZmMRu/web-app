const fs = require("fs-extra");
const path = require("path");
const { google } = require("googleapis");

// Authenticate Google Drive API
async function authenticateGoogleDrive() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

// List files in a Drive folder
async function listFilesInFolder(drive, folderId) {
  const files = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageToken: pageToken,
    });
    files.push(...res.data.files);
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return files;
}

// Download a file from Google Drive
async function downloadFile(drive, fileId, fileName, destinationFolder) {
  const destPath = path.join(destinationFolder, fileName);
  const dest = fs.createWriteStream(destPath);

  const res = await drive.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    res.data
      .on("end", () => {
        console.log(`Downloaded: ${fileName}`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error downloading file ${fileName}:`, err);
        reject(err);
      })
      .pipe(dest);
  });
}

// Main function to process the folders
async function main() {
  const drive = await authenticateGoogleDrive();

  // Root folder name
  const rootFolder = "mp3";
  fs.ensureDirSync(rootFolder);

  // Confirmed folder mapping: Folder Number -> Google Drive Folder ID
  const folderMapping = {
    2: "1Sa8EFxFLifBUOSUOg54O5JEFCJ_d_ujj",
    4: "14Aj1mw-VFYUUav53W3EcUqMDNlpPN4me",
    1: "17JyWkvK999X9B4by6lUe5D5W5ifj0R6v",
    6: "1MrbNwtI6-x-G3MADX_QKJju8AHJUBO4J",
    5: "1VpDq0FIiqShxC1_vS5cvTU5n_7cniQcb",
    7: "1iaB4OrcIpKHslicqirP6YdXiogkRwrcp",
    3: "1_6nAOnoknyVx_wJ2ByXBjjlQGD_1hUps",
  };

  // Iterate through each folder
  for (const [subfolderName, folderId] of Object.entries(folderMapping)) {
    const subfolderPath = path.join(rootFolder, subfolderName);
    fs.ensureDirSync(subfolderPath);

    console.log(`Fetching files for folder ID: ${folderId}...`);
    const files = await listFilesInFolder(drive, folderId);

    for (const file of files) {
      if (file.mimeType !== "application/vnd.google-apps.folder") {
        await downloadFile(drive, file.id, file.name, subfolderPath);
      }
    }
  }

  console.log("All files downloaded successfully!");
}

main().catch(console.error);