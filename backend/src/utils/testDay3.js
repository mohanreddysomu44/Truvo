import 'dotenv/config';
import mongoose from 'mongoose';
import { generateCertificatePDF } from '../services/pdfService.js';
import { uploadToIPFS, getIPFSUrl } from '../services/ipfsService.js';
import Certificate from '../models/Certificate.js';
import fs from 'fs';

const testDay3 = async () => {
  console.log('===========================================');
  console.log('   TRUVO — Day 3 Test');
  console.log('===========================================\n');

  // ── STEP 1: Connect to MongoDB ─────────────────────────
  console.log('Step 1: Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected!\n');

  // ── STEP 2: Generate Certificate PDF ──────────────────
  console.log('Step 2: Generating certificate PDF...');
  const certData = {
    learnerName:  'Pramod Veramalla',
    skillName:    'Full Stack Web Development',
    issuingOrg:   'MLR Institute of Technology',
    issuedDate:   new Date().toLocaleDateString('en-IN'),
    tokenId:      1,
  };

  const pdfBuffer = await generateCertificatePDF(certData);
  console.log(`PDF generated! Size: ${pdfBuffer.length} bytes`);

  // Save PDF locally so you can open and view it
  fs.writeFileSync('test-certificate1.pdf', pdfBuffer);
  console.log('PDF saved as test-certificate.pdf — open it to see!\n');

  // ── STEP 3: Upload to IPFS ─────────────────────────────
  console.log('Step 3: Uploading PDF to IPFS...');
  const cid = await uploadToIPFS(pdfBuffer, 'mohan-certificate.pdf');
  console.log(`IPFS CID: ${cid}`);
  console.log(`View PDF at: ${getIPFSUrl(cid)}\n`);

  // ── STEP 4: Save to MongoDB ────────────────────────────
  console.log('Step 4: Saving certificate record to MongoDB...');

  // Delete existing test record if it exists
  await Certificate.deleteOne({ tokenId: 1 });

  const certificate = new Certificate({
    tokenId:       1,
    ipfsCid:       cid,
    txHash:        '0xtest_transaction_hash_placeholder',
    learnerName:   'Mohan Kumar',
    learnerEmail:  'mohan@example.com',
    learnerWallet: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    skillName:     'Full Stack Web Development',
    issuingOrg:    'Truvo Training Institute',
    status:        'issued',
  });

  await certificate.save();
  console.log('Certificate saved to MongoDB!');
  console.log('MongoDB record ID:', certificate._id);
  console.log('');

  // ── STEP 5: Read back from MongoDB ────────────────────
  console.log('Step 5: Reading back from MongoDB...');
  const found = await Certificate.findOne({ tokenId: 1 });
  console.log('Found in MongoDB:');
  console.log('  Learner:  ', found.learnerName);
  console.log('  Skill:    ', found.skillName);
  console.log('  IPFS CID: ', found.ipfsCid);
  console.log('  Status:   ', found.status);
  console.log('');

  // ── SUMMARY ────────────────────────────────────────────
  console.log('===========================================');
  console.log('   Day 3 Complete!');
  console.log('===========================================');
  console.log('PDF generated:    ✅');
  console.log('Uploaded to IPFS: ✅');
  console.log('Saved to MongoDB: ✅');
  console.log('');
  console.log('IPFS CID:', cid);
  console.log('View at: ', getIPFSUrl(cid));
  console.log('');
  console.log('This CID is what gets passed to issueCertificate()');
  console.log('on the smart contract on Day 4!');

  await mongoose.disconnect();
};

testDay3().catch(console.error);