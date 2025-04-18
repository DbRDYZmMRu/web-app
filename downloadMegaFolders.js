const fs = require('fs');
const path = require { File } = require('megajs'); // Import the File class from megajs

// Folder links and decryption keys
const folders = [
  { id: 14, link: 'https://mega.nz/folder/MK9kEK4C', key: '7mbF_SsPTvvDX6Q9v0r7mg' },
  { id: 12, link: 'https://mega.nz/folder/wKNmTCbJ', key: 'RSbn3QYSDblE81GMjU6WVg' },
  { id: 8, link: 'https://mega.nz/folder/BPkXQQLK', key: 'zzpB8GJJW9rpHwSpfVhHxg' },
  { id: 13, link: 'https://mega.nz/folder/YPFknAgT', key: 'MAmycCjXWizfi1-aVjChZw' },
  { id: 11, link: 'https://mega.nz/folder/9OcCmIhI', key: '4XSXCBp4Aowx50PWHw78XQ' },
  { id: 15, link: 'https://mega.nz/folder/BX0EULyR', key: 'OYLwBW8FMYCwoCQ1reIVIg' }
];

// Directory to store downloaded files
const MP3_DIR = path.join(__dirname, 'mp3');

// Ensure the mp3 directory exists
if (!fs.existsSync(MP3_DIR)) {
  fs.mkdirSync(MP3_DIR);
}

// Function to download files recursively
const downloadFile = (file, destPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${file.name}`);
    const writeStream = fs.createWriteStream(destPath);
    const readStream = file.download();

    readStream.pipe(writeStream);

    readStream.on('end', () => {
      console.log(`Downloaded: ${file.name}`);
      resolve();
    });

    readStream.on('error', (err) => {
      console.error(`Error downloading ${file.name}:`, err);
      reject(err);
    });
  });
};

// Function to process a folder
const processFolder = async (folder, subfolderName) => {
  console.log(`Processing folder: ${subfolderName}`);

  const subfolderPath = path.join(MP3_DIR, subfolderName);

  if (!fs.existsSync(subfolderPath)) {
    fs.mkdirSync(subfolderPath);
  }

  for (const [name, child] of Object.entries(folder.children || {})) {
    const filePath = path.join(subfolderPath, name);

    if (child.directory) {
      // If it's a subfolder, recursively process it
      await processFolder(child, path.join(subfolderName, name));
    } else {
      // If it's a file, download it
      await downloadFile(child, filePath);
    }
  }
};

// Main function to process all folders
const main = async () => {
  for (const { id, link, key } of folders) {
    try {
      const folderURL = `${link}#${key}`;
      const folder = File.fromURL(folderURL);

      // Load folder attributes
      await new Promise((resolve, reject) => {
        folder.loadAttributes((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Process the folder
      await processFolder(folder, id.toString());
    } catch (err) {
      console.error(`Error processing folder ${id}:`, err);
    }
  }

  console.log('All folders processed!');
};

main().catch((err) => {
  console.error('An error occurred:', err);
});