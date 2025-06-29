
import { Router } from 'express';
import UserProfileController from '../../controllers/UserProfileController';
import { ErrorHandler } from '../../utils/request-handlers';
import passport from 'passport';

// Simple authentication middleware using passport
const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  if (req.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
};

const router = Router();


// Profile CRUD
router.get('/profile', authMiddleware, UserProfileController.getProfile);
router.put('/profile', authMiddleware, UserProfileController.updateProfile);
router.delete('/profile', authMiddleware, UserProfileController.deleteProfile);

// Preferences
router.get('/profile/preferences', authMiddleware, UserProfileController.getPreferences);
router.put('/profile/preferences', authMiddleware, UserProfileController.updatePreferences);

// Privacy
router.get('/profile/privacy', authMiddleware, UserProfileController.getPrivacySettings);
router.put('/profile/privacy', authMiddleware, UserProfileController.updatePrivacySettings);

// Account linking
router.post('/profile/link-account', authMiddleware, UserProfileController.linkAccount);
router.post('/profile/unlink-account', authMiddleware, UserProfileController.unlinkAccount);

// Profile completion
router.get('/profile/completion', authMiddleware, UserProfileController.getProfileCompletion);

// Data export
router.get('/profile/export', authMiddleware, UserProfileController.exportProfileData);

export default router;
