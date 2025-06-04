
import { Request, Response } from 'express';
import prisma from '../database/client';
import UserResource from '../resources/UserResource';
import { validate } from '../utils/validator';
import { auditLog } from '../utils/audit';

class UserProfileController {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { curator: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return new UserResource(req, res, user).json().status(200).additional({ status: 'success', message: 'OK', code: 200 });
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // Validate input
    const rules = {
      firstName: 'string',
      lastName: 'string',
      bio: 'string',
      avatar: 'string',
      phone: 'string',
      preferences: 'object',
      privacySettings: 'object',
    };
    let data: any = {};
    try {
      data = validate(req.body, rules);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: { curator: true }
    });
    await auditLog('update_profile', userId, data);
    return new UserResource(req, res, user).json().status(202).additional({ status: 'success', message: 'User updated successfully', code: 202 });
  }

  // Delete user profile
  async deleteProfile(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // GDPR: Anonymize user instead of hard delete
    const anonymized = {
      email: `deleted_${userId}@example.com`,
      password: '',
      firstName: 'Deleted',
      lastName: 'User',
      bio: '',
      avatar: null,
      phone: null,
      preferences: {},
      privacySettings: {},
      googleId: null,
      facebookId: null,
      profileCompletion: 0,
    };
    await prisma.user.update({ where: { id: userId }, data: anonymized });
    await auditLog('anonymize_profile', userId, {});
    return res.status(202).json({ status: 'success', message: 'User anonymized successfully', code: 202 });
  }

  // Get user preferences
  async getPreferences(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ preferences: (user as any).preferences || {} });
  }

  // Update user preferences
  async updatePreferences(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { preferences } = req.body;
    if (typeof preferences !== 'object') return res.status(400).json({ error: 'Invalid preferences' });
    let user;
    try {
      user = await prisma.user.update({ where: { id: userId }, data: { preferences: preferences as any } });
    } catch (e) { user = await prisma.user.findUnique({ where: { id: userId } }); }
    return res.json({ preferences: (user as any).preferences || {} });
  }

  // Get privacy settings
  async getPrivacySettings(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ privacySettings: (user as any).privacySettings || {} });
  }

  // Update privacy settings
  async updatePrivacySettings(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { privacySettings } = req.body;
    if (typeof privacySettings !== 'object') return res.status(400).json({ error: 'Invalid privacy settings' });
    let user;
    try {
      user = await prisma.user.update({ where: { id: userId }, data: { privacySettings: privacySettings as any } });
    } catch (e) { user = await prisma.user.findUnique({ where: { id: userId } }); }
    return res.json({ privacySettings: (user as any).privacySettings || {} });
  }

  // Link account (social)
  async linkAccount(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { provider, providerId } = req.body;
    if (!provider || !providerId) return res.status(400).json({ error: 'Provider and providerId required' });
    let data: any = {};
    if (provider === 'google') data.googleId = providerId;
    else if (provider === 'facebook') data.facebookId = providerId;
    else return res.status(400).json({ error: 'Unsupported provider' });
    const user = await prisma.user.update({ where: { id: userId }, data });
    await auditLog('link_account', userId, { provider, providerId });
    return res.json({ status: 'success', message: `${provider} account linked`, user });
  }

  // Unlink account (social)
  async unlinkAccount(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { provider } = req.body;
    if (!provider) return res.status(400).json({ error: 'Provider required' });
    let data: any = {};
    if (provider === 'google') data.googleId = null;
    else if (provider === 'facebook') data.facebookId = null;
    else return res.status(400).json({ error: 'Unsupported provider' });
    const user = await prisma.user.update({ where: { id: userId }, data });
    await auditLog('unlink_account', userId, { provider });
    return res.json({ status: 'success', message: `${provider} account unlinked`, user });
  }

  // Get profile completion status
  async getProfileCompletion(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Example: Calculate completion based on required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'bio', 'avatar', 'phone'];
    let completed = 0;
    requiredFields.forEach(field => { if ((user as any)[field]) completed++; });
    const percent = Math.round((completed / requiredFields.length) * 100);
    // Optionally update DB (ignore error if field doesn't exist yet)
    try {
      await prisma.user.update({ where: { id: userId }, data: { profileCompletion: percent as any } });
    } catch (e) { /* ignore if field missing */ }
    return res.json({ profileCompletion: percent });
  }

  // Export profile data (GDPR)
  async exportProfileData(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Remove sensitive fields
    const { password, ...exportData } = user;
    await auditLog('export_profile_data', userId, {});
    res.setHeader('Content-Disposition', 'attachment; filename="profile.json"');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(exportData, null, 2));
  }
}

export default new UserProfileController();
