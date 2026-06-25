import 'dotenv/config';
import axios from 'axios';
import FormData from 'form-data';

export const uploadToIPFS = async (fileBuffer, fileName) => {
  try {
    const jwt = process.env.PINATA_JWT;
    
    // Debug — let's see if JWT is loading
    console.log('JWT loaded:', jwt ? `yes (starts with ${jwt.substring(0, 15)}...)` : 'NO - undefined');

    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/pdf',
    });
    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const cid = response.data.IpfsHash;
    console.log(`Uploaded to IPFS via Pinata. CID: ${cid}`);
    return cid;

  } catch (error) {
    console.error('IPFS upload error:', error.message);
    // Show full error details
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
    }
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

export const getIPFSUrl = (cid) => {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
};