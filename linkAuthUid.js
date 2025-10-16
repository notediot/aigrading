import { updateUserAuthUid } from './dbOperation.js';

const [,, userId, authUid] = process.argv;

if (!userId || !authUid) {
  console.error('Usage: node linkAuthUid.js <userId> <authUid>');
  process.exit(1);
}

(async () => {
  try {
    await updateUserAuthUid(userId, authUid);
    console.log('Done');
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
})();
