import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import rfs from 'recursive-fs';
import basePathConverter from 'base-path-converter';
import got from 'got';

// make sure an argument is passed in
if (process.argv.length < 3) {
  console.log('Usage: npm run ipfs -- <pinataJWT>');
  process.exit(1);
}

// read first argument from command line
const pinataJWT = process.argv[2];
const JWT = `Bearer ${pinataJWT}`;

const print =
`888b    888
8888b   888
88888b  888
888Y88b 888  .d88b.  .d8888b   8888b.  88888b.   8888b.
888 Y88b888 d88""88b 88K          "88b 888 "88b     "88b
888  Y88888 888  888 "Y8888b. .d888888 888  888 .d888888
888   Y8888 Y88..88P      X88 888  888 888  888 888  888
888    Y888  "Y88P"   88888P' "Y888888 888  888 "Y888888
`;

const pinDirectoryToPinata = async () => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const src = path.join(process.cwd(), 'dist');
  let status = 0;
  try {
    const { dirs, files } = await rfs.read(src);
    let data = new FormData();
    for (const file of files) {
      data.append('file', fs.createReadStream(file), {
        filepath: basePathConverter(src, file),
      });
    }
    const response = await got(url, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        Authorization: JWT
      },
      body: data
    })
    // .on('uploadProgress', (progress) => {
    //   console.log(progress);
    // });
    console.log(print)
    console.log(JSON.parse(response.body));
    console.log('☀☀☀ Navigate to to the link below to view your site!');
    console.log(`https://nosana.mypinata.cloud/ipfs/${JSON.parse(response.body).IpfsHash}`);
  } catch (error) {
    console.log('🔥🔥🔥🔥🔥', error);
  }
};

pinDirectoryToPinata();
