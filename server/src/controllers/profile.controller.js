import * as ProfileService from '../services/profile.service.js';

export const getProfile = (req, res, next) => {
  try {
    const { id, role } = req.user;
    const result = ProfileService.getProfile(id, role);
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = (req, res, next) => {
  try {
    const { id, role } = req.user;

    const profile = ProfileService.updateProfile(id, role, req.body);
    res.json({ success: true, message: 'Cập nhật thành công', data: { profile } });
  } catch (err) {
    next(err);
  }
};

export const changePassword = (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { oldPassword, newPassword } = req.body;
    const result = ProfileService.changePassword(id, role, oldPassword, newPassword);
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { avatar } = req.body;

    if (!avatar) return next(new AppError(400, 'Vui lòng cung cấp avatar URL'));

    const data = ProfileService.updateProfile(id, role, { avatar });
    res.json({ success: true, message: 'Cập nhật avatar thành công', data });
  } catch (err) {
    next(err);
  }
};
