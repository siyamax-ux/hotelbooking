import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const FIREBASE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let firebaseCertsCache = null;
let firebaseCertsExpiry = 0;

const getFirebaseCerts = async () => {
  if (firebaseCertsCache && Date.now() < firebaseCertsExpiry) {
    return firebaseCertsCache;
  }

  const response = await fetch(FIREBASE_CERTS_URL);
  if (!response.ok) {
    throw new Error('Unable to fetch Firebase auth certificates');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  firebaseCertsExpiry = maxAgeMatch ? Date.now() + Number(maxAgeMatch[1]) * 1000 : Date.now() + 60 * 60 * 1000;
  firebaseCertsCache = await response.json();
  return firebaseCertsCache;
};

const verifyFirebaseToken = async (token) => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || !decodedToken.header?.kid || !decodedToken.payload?.aud) {
    throw new Error('Invalid Firebase token');
  }

  const certs = await getFirebaseCerts();
  const publicKey = certs[decodedToken.header.kid];
  if (!publicKey) {
    throw new Error('Invalid Firebase token key');
  }

  return jwt.verify(token, publicKey, {
    algorithms: ['RS256'],
    issuer: `https://securetoken.google.com/${decodedToken.payload.aud}`,
    audience: decodedToken.payload.aud,
  });
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const decodedToken = await verifyFirebaseToken(token);
    const firebaseUid = decodedToken.uid || decodedToken.user_id;

    if (!firebaseUid) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let user = await User.findOne({ firebaseUid });

    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email });
    }

    if (!user) {
      user = await User.create({
        firebaseUid,
        name: decodedToken.name || 'User',
        email: decodedToken.email || '',
        avatar: decodedToken.picture || '',
      });
    } else {
      let changed = false;
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        changed = true;
      }
      if (decodedToken.name && user.name !== decodedToken.name) {
        user.name = decodedToken.name;
        changed = true;
      }
      if (decodedToken.picture && user.avatar !== decodedToken.picture) {
        user.avatar = decodedToken.picture;
        changed = true;
      }
      if (decodedToken.email && user.email !== decodedToken.email) {
        user.email = decodedToken.email;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized', error: error.message });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
