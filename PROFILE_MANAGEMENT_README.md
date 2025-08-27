# Profile Management Feature

## Overview
The Profile Management feature allows users to edit their profile information and change their passwords directly from the CodeSync application interface.

## Features

### 1. Profile Information Management
- **Edit Username**: Users can update their username
- **Edit Email**: Users can update their email address
- **Validation**: Ensures username and email uniqueness across all users
- **Real-time Updates**: Changes are immediately reflected in the UI

### 2. Password Management
- **Change Password**: Users can change their password securely
- **Current Password Verification**: Requires current password for security
- **Password Confirmation**: Double confirmation to prevent typos
- **Password Requirements**: Minimum 6 characters required
- **Secure Hashing**: Passwords are hashed using bcryptjs

## User Interface

### Access
- Click the "👤 Profile" button in the top navigation bar
- The profile management modal will open with two tabs

### Profile Information Tab
- Form fields for username and email
- Pre-populated with current user data
- Update button to save changes
- Cancel button to close without saving

### Change Password Tab
- Current password field
- New password field
- Confirm new password field
- Change Password button to save changes
- Cancel button to close without saving

## Technical Implementation

### Backend
- **New Routes**:
  - `PUT /api/user/info` - Update user information
  - `PUT /api/user/password` - Change password
- **New Controller Methods**:
  - `updateUserInfo()` - Handles username and email updates
  - `changePassword()` - Handles password changes with verification
- **Security Features**:
  - JWT token authentication required
  - Current password verification for password changes
  - Unique constraint validation for username and email
  - Password hashing with bcryptjs

### Frontend
- **New Component**: `ProfileManagement.jsx`
- **AuthContext Updates**: Added `updateUserInfo()` and `changePassword()` functions
- **UI Integration**: Added profile button to VSCodeLayout navigation
- **Form Validation**: Client-side validation for password confirmation and length
- **Error Handling**: Toast notifications for success and error states

## API Endpoints

### Update User Information
```
PUT /api/user/info
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newUsername",
  "email": "newemail@example.com"
}
```

### Change Password
```
PUT /api/user/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

## Security Considerations

1. **Authentication**: All profile management operations require valid JWT tokens
2. **Password Security**: 
   - Current password verification prevents unauthorized changes
   - New passwords are hashed using bcryptjs with salt rounds of 10
   - Minimum password length enforcement
3. **Data Validation**: 
   - Username and email uniqueness validation
   - Input sanitization and validation
4. **Session Management**: User data is updated in real-time across the application

## Error Handling

- **Duplicate Username/Email**: Returns 400 error with descriptive message
- **Invalid Current Password**: Returns 400 error for password changes
- **Network Errors**: Graceful handling with user-friendly messages
- **Validation Errors**: Client-side validation with immediate feedback

## Usage Examples

### Updating Profile Information
1. Click the "👤 Profile" button in the navigation
2. Ensure "Profile Information" tab is active
3. Update username and/or email fields
4. Click "Update Profile" to save changes
5. Success message will appear

### Changing Password
1. Click the "👤 Profile" button in the navigation
2. Click "Change Password" tab
3. Enter current password
4. Enter new password (minimum 6 characters)
5. Confirm new password
6. Click "Change Password" to save
7. Success message will appear

## Future Enhancements

- Profile picture upload functionality
- Additional profile fields (bio, location, etc.)
- Two-factor authentication integration
- Password strength indicator
- Account deletion functionality
- Email verification for email changes
