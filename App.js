import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Linking, Modal, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { fastlipa } from './src/utils/fastlipa';

// Stack Navigators
const ProfileStack = createNativeStackNavigator();
const TipsterStack = createNativeStackNavigator();

// Contexts
const AuthContext = React.createContext({});
const NotificationContext = React.createContext({});

// Login Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = React.useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn({ email, password });
      
      // Show welcome message based on role
      if (result.role === 'admin') {
        Alert.alert('Welcome Admin!', 'You have been redirected to the admin panel.');
      } else {
        Alert.alert('Welcome!', 'You have been successfully logged in.');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.authContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.authHeader}>
          <Ionicons name="person-circle" size={80} color="#FFD700" />
          <Text style={styles.authTitle}>Welcome Back</Text>
          <Text style={styles.authSubtitle}>Sign in to access your account</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.formLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, isLoading && styles.authButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.authButtonText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.authFooter}>
            <Text style={styles.authFooterText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.authFooterLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Admin: beast@gmail.com / beast123</Text>
            <Text style={styles.demoText}>Tipster: tipster@test.com / tipster123</Text>
            <Text style={styles.demoText}>Verified: verified@test.com / verified123</Text>
            <Text style={styles.demoText}>User: user@test.com / user123</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Register Screen
function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signUp } = React.useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({ name, email, phone, password });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.authContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.authHeader}>
          <Ionicons name="person-add" size={80} color="#FFD700" />
          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Join CASH ODDS and start winning</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.formLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 06XXXXXXXX"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />

          <Text style={styles.formLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Create a password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <Ionicons
              name={agreeTerms ? 'checkbox' : 'square-outline'}
              size={24}
              color={agreeTerms ? '#FFD700' : '#666'}
            />
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authButton, isLoading && styles.authButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.authButtonText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <View style={styles.authFooter}>
            <Text style={styles.authFooterText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.authFooterLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Profile Screen (when logged in)
function ProfileMainScreen({ navigation }) {
  const { user, signOut, userRole } = React.useContext(AuthContext);
  const { notifications } = React.useContext(NotificationContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Role-specific badge color
  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return '#ff4444';
      case 'tipster': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  // Role-specific menu items
  const getMenuItems = () => {
    let menuItems = [];

    // Common item for all users
    menuItems.push(
      { icon: 'person', title: 'Edit Profile', subtitle: 'Update your information', onPress: () => navigation.navigate('EditProfile') }
    );

    if (userRole === 'tipster') {
      // Tipster-specific menu items (no subscriptions/payments - they earn money, not spend)
      menuItems.push(
        { 
          icon: 'add-circle', 
          title: 'Post New Tip', 
          subtitle: 'Create a new betting tip',
          onPress: () => navigation.navigate('PostTip'),
          highlight: true,
        },
        { 
          icon: 'football', 
          title: 'My Tips', 
          subtitle: 'Manage your posted tips',
          onPress: () => navigation.navigate('MyTips'),
        },
        { 
          icon: 'cash', 
          title: 'Earnings', 
          subtitle: 'View your earnings',
          onPress: () => {},
        },
        { 
          icon: 'shield-checkmark', 
          title: 'Get Verified', 
          subtitle: user?.verified ? 'You are verified ✓' : 'Apply for blue tick badge',
          onPress: () => navigation.navigate('VerificationApply'),
          highlight: !user?.verified,
          verified: user?.verified,
        }
      );
    } else {
      // Subscriber-specific menu items (Payment Methods removed)
      menuItems.push(
        { icon: 'card', title: 'My Subscriptions', subtitle: 'View your active plans', onPress: () => {} }
      );
    }

    // Common items for all users
    menuItems.push(
      { 
        icon: 'notifications', 
        title: 'Notifications', 
        subtitle: notifications.length > 0 ? `${notifications.length} unread` : 'No new notifications',
        onPress: () => navigation.navigate('Notifications'),
        badge: notifications.length,
      },
      { icon: 'settings', title: 'Settings', subtitle: 'App settings', onPress: () => navigation.navigate('Settings') },
      { icon: 'help-circle', title: 'Help & Support', subtitle: 'Contact us and get help', onPress: () => navigation.navigate('HelpSupport') }
    );

    return menuItems;
  };

  const menuItems = getMenuItems();

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={50} color="#000" />
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.profileBadgeRow}>
            <View style={[styles.profileBadge, { backgroundColor: getRoleColor() + '20' }]}>
              <Text style={[styles.profileBadgeText, { color: getRoleColor() }]}>
                {(userRole || 'subscriber').toUpperCase()}
              </Text>
            </View>
            {user?.verified && (
              <View style={styles.verifiedBadgeLarge}>
                <VerificationBadge size={16} />
                <Text style={styles.verifiedBadgeTextLarge}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section - Role based */}
        <View style={styles.statsContainer}>
          {userRole === 'tipster' ? (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Tips Posted</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Tips Won</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Days Left</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>VIP</Text>
                <Text style={styles.statLabel}>Status</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu Items */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.menuItem, 
              item.highlight && styles.menuItemHighlight
            ]} 
            onPress={item.onPress}
          >
            <View style={[
              styles.menuIconContainer,
              item.highlight && { backgroundColor: '#4CAF5020' },
              item.verified && { backgroundColor: '#2196F320' }
            ]}>
              {item.verified ? (
                <VerificationBadge size={20} />
              ) : (
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={item.highlight ? '#4CAF50' : '#FFD700'} 
                />
              )}
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[
                styles.menuTitle,
                item.highlight && { color: '#4CAF50' },
                item.verified && { color: '#2196F3' }
              ]}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            {item.badge > 0 && (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#ff4444" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={22} color="#ff4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.appVersion}>CASH ODDS v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Edit Profile Screen
function EditProfileScreen({ navigation }) {
  const { user, userRole } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile'); // 'profile' or 'password'
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://YOUR_API/api/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://YOUR_API/api/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({
      //     current_password: passwordData.currentPassword,
      //     new_password: passwordData.newPassword,
      //   }),
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Success', 'Password changed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Library', onPress: () => console.log('Choose from library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.editProfileHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.editProfileHeaderTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={styles.profilePhotoSection}>
          <View style={styles.profilePhotoContainer}>
            <View style={styles.editProfileAvatar}>
              <Ionicons name="person" size={50} color="#000" />
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handlePhotoUpload}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        {/* Section Tabs */}
        <View style={styles.sectionTabs}>
          <TouchableOpacity 
            style={[styles.sectionTab, activeSection === 'profile' && styles.sectionTabActive]}
            onPress={() => setActiveSection('profile')}
          >
            <Text style={[styles.sectionTabText, activeSection === 'profile' && styles.sectionTabTextActive]}>
              Profile Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sectionTab, activeSection === 'password' && styles.sectionTabActive]}
            onPress={() => setActiveSection('password')}
          >
            <Text style={[styles.sectionTabText, activeSection === 'password' && styles.sectionTabTextActive]}>
              Password
            </Text>
          </TouchableOpacity>
        </View>

        {activeSection === 'profile' ? (
          <>
            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
            
            <Text style={styles.formLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
            />

            <Text style={styles.formLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => setFormData({...formData, username: text})}
              placeholder="Choose a username"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            <Text style={styles.formLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.formLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="Enter your phone number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
            />

            {userRole === 'tipster' && (
              <>
                <Text style={styles.formLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.bio}
                  onChangeText={(text) => setFormData({...formData, bio: text})}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>SAVE CHANGES</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>CHANGE PASSWORD</Text>
            
            <Text style={styles.formLabel}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                placeholder="Enter current password"
                placeholderTextColor="#666"
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                placeholder="Enter new password (min 6 chars)"
                placeholderTextColor="#666"
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitButtonText}>CHANGE PASSWORD</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Settings Screen
function SettingsScreen({ navigation }) {
  const { signOut, userRole, user } = React.useContext(AuthContext);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    tipNotifications: true,
    darkMode: true,
    soundEffects: true,
  });
  
  // Delete Account Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for deleting your account');
      return;
    }
    if (!deletePassword) {
      Alert.alert('Error', 'Please enter your password to confirm');
      return;
    }

    setIsDeleting(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://YOUR_API/api/users/delete', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({
      //     reason: deleteReason,
      //     password: deletePassword,
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Account Deleted',
        'Your account has been scheduled for deletion. You will receive a confirmation email.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setDeleteModalVisible(false);
              setDeleteReason('');
              setDeletePassword('');
              signOut();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please check your password and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const SettingItem = ({ icon, title, description, value, onToggle, type = 'toggle' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon} size={20} color="#FFD700" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {description && <Text style={styles.settingItemDesc}>{description}</Text>}
        </View>
      </View>
      {type === 'toggle' ? (
        <TouchableOpacity 
          style={[styles.toggle, value && styles.toggleActive]}
          onPress={onToggle}
        >
          <View style={[styles.toggleCircle, value && styles.toggleCircleActive]} />
        </TouchableOpacity>
      ) : (
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValueText}>{value}</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.editProfileHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.editProfileHeaderTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            description="Receive push notifications"
            value={settings.pushNotifications}
            onToggle={() => toggleSetting('pushNotifications')}
          />
          <View style={styles.settingDivider} />
          <SettingItem
            icon="mail"
            title="Email Notifications"
            description="Receive email updates"
            value={settings.emailNotifications}
            onToggle={() => toggleSetting('emailNotifications')}
          />
          <View style={styles.settingDivider} />
          <SettingItem
            icon="football"
            title="Tip Notifications"
            description="Get notified about new tips"
            value={settings.tipNotifications}
            onToggle={() => toggleSetting('tipNotifications')}
          />
        </View>

        {/* Appearance Section */}
        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            icon="moon"
            title="Dark Mode"
            description="Use dark theme"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
          <View style={styles.settingDivider} />
          <SettingItem
            icon="volume-high"
            title="Sound Effects"
            description="Play sounds for actions"
            value={settings.soundEffects}
            onToggle={() => toggleSetting('soundEffects')}
          />
        </View>

        {/* About Section -->
        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="information-circle" size={20} color="#FFD700" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingItemTitle}>App Version</Text>
              </View>
            </View>
            <Text style={styles.settingValueText}>1.0.0</Text>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="document-text" size={20} color="#FFD700" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingItemTitle}>Terms of Service</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="shield" size={20} color="#FFD700" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingItemTitle}>Privacy Policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <Text style={styles.sectionLabel}>DANGER ZONE</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIconContainer, { backgroundColor: '#ff444420' }]}>
                <Ionicons name="trash" size={20} color="#ff4444" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingItemTitle, { color: '#ff4444' }]}>Delete Account</Text>
                <Text style={styles.settingItemDesc}>Permanently delete your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <TouchableOpacity onPress={() => !isDeleting && setDeleteModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.deleteAccountWarning}>
                <Ionicons name="warning" size={40} color="#ff4444" />
                <Text style={styles.deleteAccountWarningText}>
                  This action cannot be undone. All your data will be permanently deleted.
                </Text>
              </View>

              <Text style={styles.sectionLabel}>REASON FOR DELETION</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Please tell us why you're leaving..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={deleteReason}
                onChangeText={setDeleteReason}
              />

              <Text style={styles.sectionLabel}>CONFIRM PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showDeletePassword}
                  value={deletePassword}
                  onChangeText={setDeletePassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowDeletePassword(!showDeletePassword)}
                >
                  <Ionicons name={showDeletePassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.deleteConfirmBtn, isDeleting && styles.deleteConfirmBtnDisabled]}
                onPress={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="trash" size={20} color="#fff" />
                    <Text style={styles.deleteConfirmBtnText}>PERMANENTLY DELETE ACCOUNT</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Profile Stack Navigator
function ProfileStackScreen() {
  const { userToken } = React.useContext(AuthContext);

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <>
          <ProfileStack.Screen name="Login" component={LoginScreen} />
          <ProfileStack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
          <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
          <ProfileStack.Screen name="Settings" component={SettingsScreen} />
          <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
          <ProfileStack.Screen name="TipsterProfile" component={TipsterProfileScreen} />
          <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
        </>
      )}
    </ProfileStack.Navigator>
  );
}

// Professional Package Card Component
const VIPPackage = ({ title, duration, odds, price, onSubscribe }) => (
  <View style={styles.packageCard}>
    <View style={styles.packageHeader}>
      <Ionicons name="shield-checkmark" size={24} color="#FFD700" />
      <Text style={styles.packageTitle}>{title}</Text>
    </View>
    <View style={styles.packageDivider} />

    <View style={styles.featureRow}>
      <Ionicons name="calendar-outline" size={20} color="#FFD700" />
      <Text style={styles.featureText}>Validity: <Text style={styles.featureHighlight}>{duration}</Text></Text>
    </View>

    <View style={styles.featureRow}>
      <Ionicons name="analytics" size={20} color="#FFD700" />
      <Text style={styles.featureText}>Odds: <Text style={styles.featureHighlight}>{odds}</Text></Text>
    </View>

    <View style={styles.featureRow}>
      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      <Text style={styles.featureText}>Risk: <Text style={[styles.featureHighlight, { color: '#4CAF50' }]}>Fixed/Guaranteed</Text></Text>
    </View>

    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Price:</Text>
      <Text style={styles.priceValue}>{price}</Text>
    </View>

    <TouchableOpacity
      style={styles.subscribeButton}
      activeOpacity={0.7}
      onPress={onSubscribe}
    >
      <Text style={styles.subscribeText}>SUBSCRIBE NOW</Text>
      <Ionicons name="chevron-forward" size={18} color="#000" />
    </TouchableOpacity>
  </View>
);

// Follow Context for managing followed tipsters
const FollowContext = React.createContext({});

// Tipsters Screen - Browse and follow tipsters
function TipstersScreen({ navigation }) {
  const { followedTipsters, toggleFollow } = React.useContext(FollowContext);
  const [tipsters, setTipsters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, following

  useEffect(() => {
    loadTipsters();
  }, [filter]);

  const loadTipsters = async () => {
    setIsLoading(true);
    // Mock data - replace with API call
    const mockTipsters = [
      {
        id: 1,
        name: 'Pro Expert Tips',
        avatar: null,
        verified: true,
        followers: 12500,
        totalTips: 156,
        wonTips: 122,
        lostTips: 34,
        winRate: 78,
        bio: 'Professional tipster with 5+ years experience. Specializing in Premier League and Champions League.',
        recentTips: [
          { id: 101, title: 'Weekend Mega Jackpot', odds: '25.5', result: 'won', date: '2026-04-10' },
          { id: 102, title: 'Daily Sure Odds', odds: '8.5', result: 'lost', date: '2026-04-09' },
          { id: 103, title: 'Champions League Special', odds: '12.2', result: 'won', date: '2026-04-08' },
        ],
      },
      {
        id: 2,
        name: 'El Clasico King',
        avatar: null,
        verified: true,
        followers: 8900,
        totalTips: 98,
        wonTips: 71,
        lostTips: 27,
        winRate: 72,
        bio: 'La Liga specialist. Expert in Spanish football derbies and big matches.',
        recentTips: [
          { id: 201, title: 'La Liga Friday Picks', odds: '15.3', result: 'won', date: '2026-04-10' },
          { id: 202, title: 'Spanish Derby Special', odds: '20.1', result: 'won', date: '2026-04-07' },
          { id: 203, title: 'Midweek Accumulator', odds: '10.5', result: 'lost', date: '2026-04-05' },
        ],
      },
      {
        id: 3,
        name: 'Betting Master',
        avatar: null,
        verified: false,
        followers: 3200,
        totalTips: 89,
        wonTips: 52,
        lostTips: 37,
        winRate: 58,
        bio: 'Passionate about finding value in underdog matches.',
        recentTips: [
          { id: 301, title: 'Underdog Value Picks', odds: '35.2', result: 'lost', date: '2026-04-10' },
          { id: 302, title: 'Sunday Treble', odds: '6.8', result: 'won', date: '2026-04-09' },
          { id: 303, title: 'Long Shot Special', odds: '50.0', result: 'lost', date: '2026-04-06' },
        ],
      },
      {
        id: 4,
        name: 'German Football Pro',
        avatar: null,
        verified: false,
        followers: 5600,
        totalTips: 134,
        wonTips: 87,
        lostTips: 47,
        winRate: 65,
        bio: 'Bundesliga and German football expert. Following Bayern and Dortmund closely.',
        recentTips: [
          { id: 401, title: 'Bundesliga Weekend', odds: '18.5', result: 'won', date: '2026-04-10' },
          { id: 402, title: 'German Cup Picks', odds: '22.0', result: 'won', date: '2026-04-08' },
          { id: 403, title: 'Tuesday Singles', odds: '4.5', result: 'lost', date: '2026-04-06' },
        ],
      },
    ];

    // Filter tipsters
    let filtered = mockTipsters;
    if (filter === 'verified') {
      filtered = mockTipsters.filter(t => t.verified);
    } else if (filter === 'following') {
      filtered = mockTipsters.filter(t => followedTipsters.includes(t.id));
    }

    // Sort by verified first, then by followers
    filtered.sort((a, b) => {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return b.followers - a.followers;
    });

    setTimeout(() => {
      setTipsters(filtered);
      setIsLoading(false);
    }, 800);
  };

  const isFollowing = (tipsterId) => followedTipsters.includes(tipsterId);

  const renderTipsterCard = (tipster) => (
    <TouchableOpacity
      key={tipster.id}
      style={styles.tipsterCard}
      onPress={() => navigation.navigate('TipsterProfile', { tipster })}
    >
      <View style={styles.tipsterCardHeader}>
        <View style={styles.tipsterCardAvatar}>
          <Ionicons name="person" size={40} color="#000" />
        </View>
        <View style={styles.tipsterCardInfo}>
          <View style={styles.tipsterCardNameRow}>
            <Text style={styles.tipsterCardName}>{tipster.name}</Text>
            {tipster.verified && (
              <View style={styles.verifiedBadgeSmall}>
                <VerificationBadge size={12} />
              </View>
            )}
          </View>
          <Text style={styles.tipsterCardFollowers}>{tipster.followers.toLocaleString()} followers</Text>
        </View>
        <TouchableOpacity
          style={[styles.followBtn, isFollowing(tipster.id) && styles.followBtnActive]}
          onPress={() => toggleFollow(tipster.id)}
        >
          <Text style={[styles.followBtnText, isFollowing(tipster.id) && styles.followBtnTextActive]}>
            {isFollowing(tipster.id) ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tipsterCardBio} numberOfLines={2}>{tipster.bio}</Text>

      <View style={styles.tipsterCardStats}>
        <View style={styles.tipsterCardStat}>
          <Text style={styles.tipsterCardStatValue}>{tipster.winRate}%</Text>
          <Text style={styles.tipsterCardStatLabel}>Win Rate</Text>
        </View>
        <View style={styles.tipsterCardStatDivider} />
        <View style={styles.tipsterCardStat}>
          <Text style={styles.tipsterCardStatValue}>{tipster.totalTips}</Text>
          <Text style={styles.tipsterCardStatLabel}>Tips</Text>
        </View>
        <View style={styles.tipsterCardStatDivider} />
        <View style={styles.tipsterCardStat}>
          <Text style={styles.tipsterCardStatValue}>{tipster.wonTips}</Text>
          <Text style={styles.tipsterCardStatLabel}>Won</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipstersHeader}>
        <Text style={styles.tipstersTitle}>Tipsters</Text>
        <Text style={styles.tipstersSubtitle}>Discover and follow expert tipsters</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tipstersFilterContainer}>
        <TouchableOpacity
          style={[styles.tipstersFilterBtn, filter === 'all' && styles.tipstersFilterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.tipstersFilterText, filter === 'all' && styles.tipstersFilterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipstersFilterBtn, filter === 'verified' && styles.tipstersFilterBtnActive]}
          onPress={() => setFilter('verified')}
        >
          <View style={styles.verifiedFilterContent}>
            <VerificationBadge size={10} />
            <Text style={[styles.tipstersFilterText, filter === 'verified' && styles.tipstersFilterTextActive]}>Verified</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tipstersFilterBtn, filter === 'following' && styles.tipstersFilterBtnActive]}
          onPress={() => setFilter('following')}
        >
          <Text style={[styles.tipstersFilterText, filter === 'following' && styles.tipstersFilterTextActive]}>Following</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {tipsters.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={60} color="#444" />
              <Text style={styles.emptyStateText}>
                {filter === 'following' ? 'Not following any tipsters yet' : 'No tipsters found'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {filter === 'following' ? 'Start following tipsters to see them here' : 'Check back later'}
              </Text>
            </View>
          ) : (
            tipsters.map(renderTipsterCard)
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Tipster Profile Screen
function TipsterProfileScreen({ route, navigation }) {
  const { tipster } = route.params;
  const { followedTipsters, toggleFollow } = React.useContext(FollowContext);
  const isFollowing = followedTipsters.includes(tipster.id);

  const getResultColor = (result) => result === 'won' ? '#4CAF50' : '#ff4444';

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.tipsterProfileHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.tipsterProfileBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.tipsterProfileInfo}>
          <View style={styles.tipsterProfileAvatar}>
            <Ionicons name="person" size={60} color="#000" />
          </View>
          
          <View style={styles.tipsterProfileNameRow}>
            <Text style={styles.tipsterProfileName}>{tipster.name}</Text>
            {tipster.verified && (
              <View style={styles.verifiedBadgeLarge}>
                <VerificationBadge size={16} />
              </View>
            )}
          </View>

          <Text style={styles.tipsterProfileBio}>{tipster.bio}</Text>

          {/* Follow Button */}
          <TouchableOpacity
            style={[styles.tipsterProfileFollowBtn, isFollowing && styles.tipsterProfileFollowBtnActive]}
            onPress={() => toggleFollow(tipster.id)}
          >
            <Ionicons 
              name={isFollowing ? "checkmark" : "add"} 
              size={20} 
              color={isFollowing ? '#000' : '#000'} 
            />
            <Text style={styles.tipsterProfileFollowBtnText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.tipsterProfileStatsGrid}>
          <View style={styles.tipsterProfileStatBox}>
            <Text style={styles.tipsterProfileStatValue}>{tipster.followers.toLocaleString()}</Text>
            <Text style={styles.tipsterProfileStatLabel}>Followers</Text>
          </View>
          <View style={styles.tipsterProfileStatBox}>
            <Text style={styles.tipsterProfileStatValue}>{tipster.winRate}%</Text>
            <Text style={styles.tipsterProfileStatLabel}>Win Rate</Text>
          </View>
          <View style={styles.tipsterProfileStatBox}>
            <Text style={styles.tipsterProfileStatValue}>{tipster.totalTips}</Text>
            <Text style={styles.tipsterProfileStatLabel}>Total Tips</Text>
          </View>
        </View>

        {/* Win/Loss Stats */}
        <View style={styles.tipsterWinLossContainer}>
          <View style={styles.tipsterWinLossBar}>
            <View 
              style={[
                styles.tipsterWinBar, 
                { width: `${tipster.winRate}%` }
              ]} 
            />
          </View>
          <View style={styles.tipsterWinLossLabels}>
            <Text style={styles.tipsterWinLabel}>{tipster.wonTips} Won</Text>
            <Text style={styles.tipsterLossLabel}>{tipster.lostTips} Lost</Text>
          </View>
        </View>

        {/* Recent Tips */}
        <Text style={styles.sectionLabel}>RECENT TIPS</Text>
        {tipster.recentTips.map((tip) => (
          <View key={tip.id} style={styles.tipsterRecentTipCard}>
            <View style={styles.tipsterRecentTipHeader}>
              <View style={styles.tipsterRecentTipResult}>
                <View style={[styles.tipsterResultBadge, { backgroundColor: getResultColor(tip.result) + '20' }]}>
                  <Text style={[styles.tipsterResultText, { color: getResultColor(tip.result) }]}>
                    {tip.result.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.tipsterRecentTipDate}>{tip.date}</Text>
              </View>
            </View>
            <Text style={styles.tipsterRecentTipTitle}>{tip.title}</Text>
            <Text style={styles.tipsterRecentTipOdds}>Odds: {tip.odds}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


// VIP Access Context - shared state for VIP access
const VIPAccessContext = React.createContext({});

function VIPTipsScreen() {
  const { userToken } = React.useContext(AuthContext);
  const { hasVIPAccess, setHasVIPAccess } = React.useContext(VIPAccessContext);
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTip, setSelectedTip] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [bookingCodesModalVisible, setBookingCodesModalVisible] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionTitle, setTransactionTitle] = useState('Initiating Payment...');
  const [tranID, setTranID] = useState(null);

  useEffect(() => {
    loadVIPTips();
  }, [filter]);

  const loadVIPTips = async () => {
    setIsLoading(true);
    const mockTips = [
      {
        id: 1,
        title: 'Weekend Mega Jackpot',
        description: 'Best picks for maximum returns this weekend',
        total_odds: '25.5',
        tipster: { name: 'Pro Expert Tips', verified: true, followers: 12500, winRate: '78%' },
        custom_price: 5000,
        booking_codes: [{ company: '1xBet', code: 'ABC123XYZ' }, { company: 'Betway', code: 'BW789VIP' }],
        created_at: '2026-04-11 10:00:00',
        views: 345,
      },
      {
        id: 2,
        title: 'Daily Sure Odds',
        description: 'Guaranteed win selections for today',
        total_odds: '8.5',
        tipster: { name: 'Betting Master', verified: false, followers: 3200, winRate: '65%' },
        custom_price: 2000,
        booking_codes: [{ company: 'SportPesa', code: 'SP2026DAILY' }],
        created_at: '2026-04-11 08:00:00',
        views: 189,
      },
      {
        id: 3,
        title: 'El Clasico Special',
        description: 'Premium picks for the big match',
        total_odds: '15.2',
        tipster: { name: 'El Clasico King', verified: true, followers: 8900, winRate: '72%' },
        custom_price: 8000,
        booking_codes: [{ company: 'SportPesa', code: 'SPCLASICO' }, { company: 'Betika', code: 'BTKCL2026' }],
        created_at: '2026-04-10 14:00:00',
        views: 567,
      },
    ];
    
    const sortedTips = mockTips.sort((a, b) => {
      if (a.tipster.verified && !b.tipster.verified) return -1;
      if (!a.tipster.verified && b.tipster.verified) return 1;
      return b.tipster.followers - a.tipster.followers;
    });
    
    setTimeout(() => {
      setTips(filter === 'verified' ? sortedTips.filter(t => t.tipster.verified) : sortedTips);
      setIsLoading(false);
    }, 1000);
  };

  const handlePurchaseTip = (tip) => {
    if (hasVIPAccess) {
      setSelectedTip(tip);
      setBookingCodesModalVisible(true);
    } else {
      setSelectedTip(tip);
      setPaymentModalVisible(true);
    }
  };

  const startPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Invalid Input", "Please enter a valid phone number");
      return;
    }
    setIsProcessing(true);
    setTransactionTitle("Sending Push Prompt...");
    try {
      const res = await fastlipa.createTransaction(phoneNumber, selectedTip.custom_price);
      if (res && res.tranid) {
        setTranID(res.tranid);
        setTransactionTitle("Waiting for Confirmation...");
        checkPaymentStatus(res.tranid);
      }
    } catch (error) {
      Alert.alert("Payment Error", error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (id) => {
    let attempts = 0;
    const poll = async () => {
      try {
        const res = await fastlipa.checkStatus(id);
        if (res.status === 'Completed') {
          setIsProcessing(false);
          setPaymentModalVisible(false);
          setHasVIPAccess(true);
          Alert.alert("Payment Successful!", "You now have access to VIP tips.",
            [{ text: "View Codes", onPress: () => setBookingCodesModalVisible(true) }]);
        } else if (res.status === 'Failed' || res.status === 'Cancelled') {
          setIsProcessing(false);
          Alert.alert("Payment Failed", "Transaction unsuccessful");
        } else if (attempts < 20) {
          attempts++;
          setTimeout(poll, 3000);
        } else {
          setIsProcessing(false);
          Alert.alert("Timeout", "Could not confirm payment");
        }
      } catch (error) {
        setIsProcessing(false);
      }
    };
    poll();
  };

  const getConfidenceColor = (c) => c === 'high' ? '#4CAF50' : c === 'medium' ? '#FFD700' : '#FF9800';

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.vipScreenHeader}>
        <View>
          <Text style={styles.vipScreenTitle}>VIP Tips</Text>
          <Text style={styles.vipScreenSubtitle}>Premium tips from verified tipsters</Text>
        </View>
        <View style={styles.vipFilterContainer}>
          <TouchableOpacity style={[styles.vipFilterBtn, filter === 'all' && styles.vipFilterBtnActive]} onPress={() => setFilter('all')}>
            <Text style={[styles.vipFilterText, filter === 'all' && styles.vipFilterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.vipFilterBtn, filter === 'verified' && styles.vipFilterBtnActive]} onPress={() => setFilter('verified')}>
            <Text style={[styles.vipFilterText, filter === 'verified' && styles.vipFilterTextActive]}>Verified</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {tips.map(tip => (
            <View key={tip.id} style={styles.vipTipCard}>
              <View style={styles.vipTipHeader}>
                <View style={styles.tipsterInfo}>
                  <View style={styles.tipsterAvatar}>
                    <Ionicons name="person" size={24} color="#000" />
                  </View>
                  <View>
                    <View style={styles.tipsterNameRow}>
                      <Text style={styles.tipsterName}>{tip.tipster.name}</Text>
                      {tip.tipster.verified && <VerificationBadge size={12} />}
                    </View>
                    <Text style={styles.tipsterStats}>{tip.tipster.winRate} win rate • {tip.tipster.followers} followers</Text>
                  </View>
                </View>
                <View style={styles.vipBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.vipBadgeText}>VIP</Text>
                </View>
              </View>
              
              {/* Tip Title & Description */}
              <Text style={styles.vipTeams}>{tip.title}</Text>
              <Text style={styles.vipPrediction}>{tip.description}</Text>
              
              {/* Total Odds */}
              <View style={styles.vipTotalOddsRow}>
                <Ionicons name="trending-up" size={18} color="#FFD700" />
                <Text style={styles.vipTotalOddsText}>Total Odds: {tip.total_odds}</Text>
              </View>
              
              <View style={styles.vipActionRow}>
                <View>
                  <Text style={styles.vipPriceLabel}>Price</Text>
                  <Text style={styles.vipPrice}>{tip.custom_price?.toLocaleString()} Tshs</Text>
                </View>
                <TouchableOpacity style={styles.vipPurchaseBtn} onPress={() => handlePurchaseTip(tip)}>
                  <Ionicons name={hasVIPAccess ? "eye" : "lock-open"} size={18} color="#000" />
                  <Text style={styles.vipPurchaseBtnText}>{hasVIPAccess ? 'VIEW CODES' : 'UNLOCK'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={paymentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Unlock VIP Tip</Text>
              <TouchableOpacity onPress={() => !isProcessing && setPaymentModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {isProcessing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.processingText}>{transactionTitle}</Text>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput style={styles.input} placeholder="06XXXXXXXX" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                <Text style={styles.amountText}>Amount: {selectedTip?.custom_price} Tshs</Text>
                <TouchableOpacity style={styles.payButton} onPress={startPayment}>
                  <Text style={styles.payButtonText}>UNLOCK NOW</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={bookingCodesModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Codes</Text>
              <TouchableOpacity onPress={() => setBookingCodesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              {/* Tip Info */}
              <View style={styles.bookingCodesTipInfo}>
                <Text style={styles.bookingCodesMatch}>{selectedTip?.title}</Text>
                <Text style={styles.bookingCodesPrediction}>{selectedTip?.description}</Text>
                <View style={styles.vipTotalOddsRow}>
                  <Ionicons name="trending-up" size={18} color="#FFD700" />
                  <Text style={styles.vipTotalOddsText}>Total Odds: {selectedTip?.total_odds}</Text>
                </View>
                <View style={styles.bookingCodesTipster}>
                  <Text style={styles.bookingCodesBy}>By {selectedTip?.tipster?.name}</Text>
                  {selectedTip?.tipster?.verified && <VerificationBadge size={12} />}
                </View>
              </View>
              
              <Text style={styles.sectionLabel}>BOOKING CODES</Text>
              {selectedTip?.booking_codes?.map((code, i) => (
                <View key={i} style={styles.bookingCodeCard}>
                  <View style={styles.bookingCodeCardHeader}>
                    <View style={styles.companyLogo}>
                      <Text style={styles.companyLogoText}>{code.company[0]}</Text>
                    </View>
                    <Text style={styles.companyName}>{code.company}</Text>
                  </View>
                  <View style={styles.bookingCodeValueBox}>
                    <Text style={styles.bookingCodeLabel}>Booking Code</Text>
                    <View style={styles.codeRow}>
                      <Text style={styles.bookingCodeValue}>{code.code}</Text>
                      <TouchableOpacity 
                        style={styles.copyCodeBtn}
                        onPress={() => Alert.alert('Copied!', `${code.code} copied to clipboard`)}
                      >
                        <Ionicons name="copy" size={18} color="#FFD700" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
// Tips History Screen - Shows purchased VIP tips
function TipsHistoryScreen({ navigation }) {
  const { userToken } = React.useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, won, lost, pending

  useEffect(() => {
    loadPurchaseHistory();
  }, [filter]);

  const loadPurchaseHistory = async () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('http://YOUR_API/api/purchases/my', {
    //     headers: { 'Authorization': `Bearer ${userToken}` }
    //   });
    //   const data = await response.json();
    //   setPurchases(data.purchases);
    // } catch (error) {
    //   console.error('Error loading purchases:', error);
    // }

    // Mock data
    const mockPurchases = [
      {
        purchase_id: 'p1',
        tip_id: 't1',
        title: 'Weekend Mega Jackpot',
        description: 'Best picks for maximum returns',
        total_odds: '25.5',
        tip_status: 'won',
        amount: 5000,
        purchased_at: '2026-04-10 14:30:00',
        tipster_name: 'Pro Expert Tips',
        tipster_verified: true,
        booking_codes: [
          { company: '1xBet', code: 'ABC123XYZ' },
          { company: 'Betway', code: 'BW789VIP' },
        ],
      },
      {
        purchase_id: 'p2',
        tip_id: 't2',
        title: 'Champions League Special',
        description: 'Premium UCL selections',
        total_odds: '12.8',
        tip_status: 'pending',
        amount: 8000,
        purchased_at: '2026-04-08 09:15:00',
        tipster_name: 'El Clasico King',
        tipster_verified: true,
        booking_codes: [
          { company: 'SportPesa', code: 'SPCLASICO' },
        ],
      },
      {
        purchase_id: 'p3',
        tip_id: 't3',
        title: 'Daily Sure Odds',
        description: 'Guaranteed win picks',
        total_odds: '8.5',
        tip_status: 'lost',
        amount: 3000,
        purchased_at: '2026-04-05 16:45:00',
        tipster_name: 'Betting Master',
        tipster_verified: false,
        booking_codes: [
          { company: 'Betika', code: 'BTK12345' },
          { company: 'Odibets', code: 'ODI67890' },
        ],
      },
    ];

    // Apply filter
    let filtered = mockPurchases;
    if (filter !== 'all') {
      filtered = mockPurchases.filter(p => p.tip_status === filter);
    }

    setTimeout(() => {
      setPurchases(filtered);
      setIsLoading(false);
    }, 800);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return '#4CAF50';
      case 'lost': return '#ff4444';
      default: return '#FFD700';
    }
  };

  const renderPurchaseCard = (purchase) => (
    <View key={purchase.purchase_id} style={styles.purchaseCard}>
      <View style={styles.purchaseHeader}>
        <View style={styles.purchaseTipsterInfo}>
          <Text style={styles.purchaseTipsterName}>{purchase.tipster_name}</Text>
          {purchase.tipster_verified && (
            <View style={styles.verifiedBadgeSmall}>
              <VerificationBadge size={10} />
            </View>
          )}
        </View>
        <View style={[styles.purchaseStatusBadge, { backgroundColor: getStatusColor(purchase.tip_status) + '20' }]}>
          <Text style={[styles.purchaseStatusText, { color: getStatusColor(purchase.tip_status) }]}>
            {purchase.tip_status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.purchaseTitle}>{purchase.title}</Text>
      <Text style={styles.purchaseDescription}>{purchase.description}</Text>

      <View style={styles.purchaseStats}>
        <View style={styles.purchaseStat}>
          <Ionicons name="trending-up" size={16} color="#FFD700" />
          <Text style={styles.purchaseStatText}>Odds: {purchase.total_odds}</Text>
        </View>
        <View style={styles.purchaseStat}>
          <Ionicons name="cash-outline" size={16} color="#4CAF50" />
          <Text style={styles.purchaseStatText}>Tshs {purchase.amount.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.purchaseDate}>
        Purchased: {new Date(purchase.purchased_at).toLocaleDateString()}
      </Text>

      {/* Booking Codes */}
      <View style={styles.purchaseBookingCodes}>
        <Text style={styles.purchaseCodesLabel}>Booking Codes:</Text>
        {purchase.booking_codes.map((code, index) => (
          <View key={index} style={styles.purchaseCodeRow}>
            <View style={styles.purchaseCompanyBadge}>
              <Text style={styles.purchaseCompanyText}>{code.company}</Text>
            </View>
            <Text style={styles.purchaseCodeText}>{code.code}</Text>
            <TouchableOpacity 
              onPress={() => Alert.alert('Copied!', `${code.code} copied to clipboard`)}
            >
              <Ionicons name="copy-outline" size={18} color="#FFD700" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsHistoryHeader}>
        <Text style={styles.tipsHistoryTitle}>My Tips History</Text>
        <Text style={styles.tipsHistorySubtitle}>All your purchased VIP tips</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tipsHistoryFilterContainer}>
        {['all', 'won', 'lost', 'pending'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.tipsHistoryFilterBtn, filter === f && styles.tipsHistoryFilterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.tipsHistoryFilterText, filter === f && styles.tipsHistoryFilterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {purchases.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#444" />
              <Text style={styles.emptyStateText}>No purchases found</Text>
              <Text style={styles.emptyStateSubtext}>
                {filter === 'all' 
                  ? 'Start purchasing VIP tips to see them here' 
                  : `No ${filter} tips found`}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.tipsHistorySummary}>
                <Text style={styles.tipsHistorySummaryText}>
                  Showing {purchases.length} {filter === 'all' ? 'purchases' : filter + ' tips'}
                </Text>
              </View>
              {purchases.map(renderPurchaseCard)}
            </>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Reusable Contact Link Component
const ContactLink = ({ icon, title, subtitle, color, url }) => (
  <TouchableOpacity
    style={styles.contactCard}
    activeOpacity={0.7}
    onPress={() => Linking.openURL(url).catch(err => console.error("Couldn't load page", err))}
  >
    <View style={[styles.contactIconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <View style={styles.contactTextContainer}>
      <Text style={styles.contactTitle}>{title}</Text>
      <Text style={styles.contactSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="open-outline" size={20} color="#444" />
  </TouchableOpacity>
);

function HelpSupportScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.helpSupportHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.helpSupportHeaderTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Ionicons name="chatbubbles-outline" size={60} color="#FFD700" style={{ marginBottom: 15 }} />
          <Text style={styles.mainTitle}>Get In Touch</Text>
          <Text style={styles.mainSubtitle}>Join our communities or speak with our support team directly.</Text>
        </View>

        <Text style={styles.sectionLabel}>WHATSAPP COMMUNITES</Text>
        <ContactLink
          icon="logo-whatsapp"
          title="WhatsApp Channel"
          subtitle="Get instant updates and daily tips"
          color="#25D366"
          url="https://whatsapp.com/channel/example"
        />
        <ContactLink
          icon="people-outline"
          title="WhatsApp Group"
          subtitle="Discuss matches with other winners"
          color="#25D366"
          url="https://chat.whatsapp.com/example"
        />

        <Text style={styles.sectionLabel}>TELEGRAM STATION</Text>
        <ContactLink
          icon="paper-plane"
          title="Telegram Channel"
          subtitle="Join the official CASH ODDS main channel"
          color="#0088cc"
          url="https://t.me/example"
        />

        <Text style={styles.sectionLabel}>SOCIAL MEDIA</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialIconBtn}
            onPress={() => Linking.openURL('https://instagram.com/example')}
          >
            <Ionicons name="logo-instagram" size={30} color="#E4405F" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIconBtn}
            onPress={() => Linking.openURL('https://twitter.com/example')}
          >
            <Ionicons name="logo-twitter" size={30} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIconBtn}
            onPress={() => Linking.openURL('https://facebook.com/example')}
          >
            <Ionicons name="logo-facebook" size={30} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialIconBtn}
            onPress={() => Linking.openURL('https://tiktok.com/@example')}
          >
            <Ionicons name="logo-tiktok" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.supportInfo}>
          <Text style={styles.supportText}>Support Hours: 24/7</Text>
          <Text style={styles.supportText}>Email: support@cashodds.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

// Admin Stack Navigator
const AdminStack = createNativeStackNavigator();

// Verification Badge Component
const VerificationBadge = ({ size = 16 }) => (
  <View style={[styles.verificationBadge, { width: size, height: size, borderRadius: size / 2 }]}>
    <Ionicons name="checkmark" size={size * 0.7} color="#fff" />
  </View>
);

// Tipster Verification Application Screen
function VerificationApplicationScreen({ navigation }) {
  const { user, userToken } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    experience: '',
    expertise: '',
    socialLinks: '',
    whyVerify: '',
    idImage: null,
    selfieImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  const IMGBB_API_KEY = '3aa324878a27b8ebaea52aaa9b5aa01d';

  const pickImage = async (type) => {
    // For web compatibility, we'll use a simulated upload
    // In production with Expo, you would use ImagePicker from 'expo-image-picker'
    Alert.alert(
      'Upload Image',
      `Select source for ${type === 'id' ? 'National ID' : 'your photo'}:`,
      [
        { 
          text: 'Take Photo', 
          onPress: () => handleImageSelection(type)
        },
        { 
          text: 'Choose from Gallery', 
          onPress: () => handleImageSelection(type)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleImageSelection = async (type) => {
    // Step 1: Show selecting state
    if (type === 'id') {
      setUploadingId(true);
    } else {
      setUploadingSelfie(true);
    }

    try {
      // Step 2: Simulate image selection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production with expo-image-picker:
      // const result = await ImagePicker.launchImageLibraryAsync({...})
      // if (result.canceled) {
      //   setUploadingId(false); // or setUploadingSelfie(false)
      //   return; // User cancelled, don't proceed
      // }
      // const imageUri = result.assets[0].uri;
      
      // Step 3: Simulate upload to imgbb
      const uploadedUrl = await uploadImageToServer(type);
      
      if (uploadedUrl) {
        setFormData(prev => ({
          ...prev,
          [type === 'id' ? 'idImage' : 'selfieImage']: {
            uri: uploadedUrl,
            uploaded: true
          }
        }));
        Alert.alert('Success', `${type === 'id' ? 'National ID' : 'Photo'} uploaded successfully`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      if (type === 'id') {
        setUploadingId(false);
      } else {
        setUploadingSelfie(false);
      }
    }
  };

  const uploadImageToServer = async (type) => {
    // Simulate API upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock URL based on type
    // In production, this would upload to imgbb and return the actual URL
    return type === 'id' 
      ? 'https://i.ibb.co/placeholder/national-id.jpg'
      : 'https://i.ibb.co/placeholder/selfie.jpg';
  };

  // Actual imgbb upload function for production use
  const uploadToImgbb = async (imageUri, type) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`,
    });
    formData.append('key', IMGBB_API_KEY);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Imgbb upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.experience || !formData.expertise || !formData.whyVerify) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.idImage || !formData.selfieImage) {
      Alert.alert('Error', 'Please upload both your National ID and a photo of yourself');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://YOUR_API/api/verification-requests', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({
      //     full_name: formData.fullName,
      //     phone: formData.phone,
      //     email: formData.email,
      //     experience: formData.experience,
      //     expertise: formData.expertise,
      //     social_links: formData.socialLinks,
      //     why_verify: formData.whyVerify,
      //     id_image_url: formData.idImage.uri,
      //     selfie_image_url: formData.selfieImage.uri,
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Application Submitted!',
        'Your verification request has been submitted with your documents. Our team will review and respond within 3-5 business days.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsterHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tipsterHeaderTitle}>Apply for Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.verificationIntro}>
          <View style={styles.verificationBadgeLarge}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text style={styles.verificationIntroTitle}>Get Verified</Text>
          <Text style={styles.verificationIntroText}>
            Verified tipsters get a blue checkmark badge, increased visibility, and higher credibility with subscribers.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
        <Text style={styles.formLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(text) => setFormData({...formData, fullName: text})}
          placeholderTextColor="#666"
        />

        <Text style={styles.formLabel}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
          placeholderTextColor="#666"
          keyboardType="phone-pad"
        />

        <Text style={styles.formLabel}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          placeholderTextColor="#666"
          keyboardType="email-address"
        />

        <Text style={styles.sectionLabel}>PROFESSIONAL INFORMATION</Text>
        <Text style={styles.formLabel}>Years of Experience *</Text>
        <TextInput
          style={styles.input}
          value={formData.experience}
          onChangeText={(text) => setFormData({...formData, experience: text})}
          placeholder="e.g. 5 years"
          placeholderTextColor="#666"
        />

        <Text style={styles.formLabel}>Areas of Expertise *</Text>
        <TextInput
          style={styles.input}
          value={formData.expertise}
          onChangeText={(text) => setFormData({...formData, expertise: text})}
          placeholder="e.g. Premier League, La Liga, Champions League"
          placeholderTextColor="#666"
        />

        <Text style={styles.formLabel}>Social Media Links</Text>
        <TextInput
          style={styles.input}
          value={formData.socialLinks}
          onChangeText={(text) => setFormData({...formData, socialLinks: text})}
          placeholder="Twitter, Instagram, Telegram, etc."
          placeholderTextColor="#666"
        />

        <Text style={styles.formLabel}>Why should we verify you? *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.whyVerify}
          onChangeText={(text) => setFormData({...formData, whyVerify: text})}
          placeholder="Tell us about your track record and why you deserve verification..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionLabel}>DOCUMENTATION *</Text>
        <Text style={styles.formLabel}>National ID *</Text>
        <TouchableOpacity 
          style={[styles.idUploadButton, formData.idImage?.uploaded && styles.idUploadButtonSuccess]}
          onPress={() => pickImage('id')}
          disabled={uploadingId}
        >
          {uploadingId ? (
            <ActivityIndicator size="large" color="#FFD700" />
          ) : formData.idImage?.uploaded ? (
            <>
              <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
              <Text style={styles.idUploadText}>National ID Uploaded</Text>
              <Text style={styles.idUploadSubtext}>Tap to change</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={30} color="#FFD700" />
              <Text style={styles.idUploadText}>Upload National ID</Text>
              <Text style={styles.idUploadSubtext}>Front side of your ID card</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.formLabel}>Your Photo *</Text>
        <TouchableOpacity 
          style={[styles.idUploadButton, formData.selfieImage?.uploaded && styles.idUploadButtonSuccess]}
          onPress={() => pickImage('selfie')}
          disabled={uploadingSelfie}
        >
          {uploadingSelfie ? (
            <ActivityIndicator size="large" color="#FFD700" />
          ) : formData.selfieImage?.uploaded ? (
            <>
              <Ionicons name="checkmark-circle" size={30} color="#4CAF50" />
              <Text style={styles.idUploadText}>Photo Uploaded</Text>
              <Text style={styles.idUploadSubtext}>Tap to change</Text>
            </>
          ) : (
            <>
              <Ionicons name="camera" size={30} color="#FFD700" />
              <Text style={styles.idUploadText}>Upload Your Photo</Text>
              <Text style={styles.idUploadSubtext}>Clear photo of yourself holding your ID</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.verificationNote}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.verificationNoteText}>
            By applying, you agree that all information provided is accurate. False information may result in account suspension.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitButtonText}>SUBMIT APPLICATION</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Verification Requests Screen
function AdminVerificationScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    // Mock verification requests with image URLs
    setRequests([
      { 
        id: 1, 
        name: 'Expert Pro Tips', 
        email: 'expert@example.com', 
        phone: '+255712345678',
        experience: '7 years', 
        expertise: 'Premier League, Bundesliga',
        socialLinks: '@expertprotips (Twitter), @expertips (Telegram)',
        whyVerify: 'I have a proven track record with 75% win rate over 3 years and over 10,000 followers.',
        status: 'pending',
        appliedDate: '2026-04-08',
        currentStats: { tips: 156, winRate: '72%', followers: 2400 },
        idImageUrl: 'https://i.ibb.co/example/national-id-1.jpg',
        selfieImageUrl: 'https://i.ibb.co/example/selfie-1.jpg',
      },
      { 
        id: 2, 
        name: 'King of Odds', 
        email: 'king@example.com', 
        phone: '+255723456789',
        experience: '5 years', 
        expertise: 'Champions League, Serie A',
        socialLinks: '@kingofodds (Instagram), t.me/kingodds (Telegram)',
        whyVerify: 'Consistent winner with verified results. Featured on major betting platforms.',
        status: 'pending',
        appliedDate: '2026-04-07',
        currentStats: { tips: 89, winRate: '68%', followers: 1200 },
        idImageUrl: 'https://i.ibb.co/example/national-id-2.jpg',
        selfieImageUrl: 'https://i.ibb.co/example/selfie-2.jpg',
      },
      { 
        id: 3, 
        name: 'Betting Guru', 
        email: 'guru@example.com', 
        phone: '+255734567890',
        experience: '3 years', 
        expertise: 'La Liga, Ligue 1',
        socialLinks: '@bettingguru (Twitter)',
        whyVerify: 'Looking to build trust with my growing audience.',
        status: 'approved',
        appliedDate: '2026-04-05',
        currentStats: { tips: 45, winRate: '65%', followers: 500 },
        idImageUrl: 'https://i.ibb.co/example/national-id-3.jpg',
        selfieImageUrl: 'https://i.ibb.co/example/selfie-3.jpg',
      },
    ]);
  }, []);

  const handleApprove = (requestId) => {
    Alert.alert(
      'Approve Verification',
      'Are you sure you want to approve this verification request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve', 
          style: 'default',
          onPress: () => {
            setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
            Alert.alert('Success', 'Verification request approved!');
          }
        },
      ]
    );
  };

  const handleReject = (requestId) => {
    Alert.alert(
      'Reject Verification',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
          }
        },
      ]
    );
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const openImage = (url) => {
    // In a real app, this would open the image in a full-screen viewer
    Alert.alert('View Image', 'Opening image...');
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Verification Requests</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.verificationStats}>
        <View style={styles.verificationStat}>
          <Text style={styles.verificationStatValue}>{requests.filter(r => r.status === 'pending').length}</Text>
          <Text style={styles.verificationStatLabel}>Pending</Text>
        </View>
        <View style={styles.verificationStat}>
          <Text style={styles.verificationStatValue}>{requests.filter(r => r.status === 'approved').length}</Text>
          <Text style={styles.verificationStatLabel}>Approved</Text>
        </View>
        <View style={styles.verificationStat}>
          <Text style={styles.verificationStatValue}>{requests.filter(r => r.status === 'rejected').length}</Text>
          <Text style={styles.verificationStatLabel}>Rejected</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>PENDING REQUESTS</Text>
        {requests.filter(r => r.status === 'pending').map((request) => (
          <TouchableOpacity key={request.id} style={styles.verificationRequestCard} onPress={() => viewDetails(request)}>
            <View style={styles.verificationRequestHeader}>
              <View style={styles.verificationRequestUser}>
                <Text style={styles.verificationRequestName}>{request.name}</Text>
                <Text style={styles.verificationRequestDate}>Applied {request.appliedDate}</Text>
              </View>
              <View style={styles.verificationRequestStatus}>
                <View style={[styles.statusIndicator, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.statusIndicatorText}>Pending</Text>
              </View>
            </View>
            <Text style={styles.verificationRequestExpertise}>{request.expertise}</Text>
            <View style={styles.verificationRequestStats}>
              <Text style={styles.verificationRequestStat}>{request.currentStats.tips} tips</Text>
              <Text style={styles.verificationRequestStat}>{request.currentStats.winRate} win rate</Text>
              <Text style={styles.verificationRequestStat}>{request.currentStats.followers} followers</Text>
            </View>
            <View style={styles.verificationRequestActions}>
              <TouchableOpacity 
                style={[styles.verificationActionBtn, { backgroundColor: '#4CAF5020' }]}
                onPress={() => handleApprove(request.id)}
              >
                <Text style={[styles.verificationActionBtnText, { color: '#4CAF50' }]}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.verificationActionBtn, { backgroundColor: '#ff444420' }]}
                onPress={() => handleReject(request.id)}
              >
                <Text style={[styles.verificationActionBtnText, { color: '#ff4444' }]}>Reject</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>HISTORY</Text>
        {requests.filter(r => r.status !== 'pending').map((request) => (
          <View key={request.id} style={[styles.verificationRequestCard, { opacity: 0.7 }]}>
            <View style={styles.verificationRequestHeader}>
              <View style={styles.verificationRequestUser}>
                <Text style={styles.verificationRequestName}>{request.name}</Text>
                <Text style={styles.verificationRequestDate}>Applied {request.appliedDate}</Text>
              </View>
              <View style={[styles.verificationRequestStatus, { 
                backgroundColor: request.status === 'approved' ? '#4CAF5020' : '#ff444420',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
              }]}>
                <Text style={[styles.statusIndicatorText, { 
                  color: request.status === 'approved' ? '#4CAF50' : '#ff4444',
                  fontWeight: 'bold',
                }]}>{request.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.verificationRequestExpertise}>{request.expertise}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={detailModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verification Request</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {selectedRequest && (
                <>
                  <View style={styles.verificationDetailHeader}>
                    <Text style={styles.verificationDetailName}>{selectedRequest.name}</Text>
                    <Text style={styles.verificationDetailDate}>Applied {selectedRequest.appliedDate}</Text>
                  </View>

                  <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
                  <View style={styles.verificationDetailInfo}>
                    <Text style={styles.verificationDetailLabel}>Email</Text>
                    <Text style={styles.verificationDetailValue}>{selectedRequest.email}</Text>
                    
                    <Text style={styles.verificationDetailLabel}>Phone</Text>
                    <Text style={styles.verificationDetailValue}>{selectedRequest.phone}</Text>
                    
                    <Text style={styles.verificationDetailLabel}>Experience</Text>
                    <Text style={styles.verificationDetailValue}>{selectedRequest.experience}</Text>
                    
                    <Text style={styles.verificationDetailLabel}>Expertise</Text>
                    <Text style={styles.verificationDetailValue}>{selectedRequest.expertise}</Text>
                    
                    <Text style={styles.verificationDetailLabel}>Social Links</Text>
                    <Text style={styles.verificationDetailValue}>{selectedRequest.socialLinks}</Text>
                  </View>

                  <Text style={styles.sectionLabel}>WHY VERIFY</Text>
                  <Text style={styles.verificationDetailWhy}>{selectedRequest.whyVerify}</Text>

                  <Text style={styles.sectionLabel}>DOCUMENTS</Text>
                  <View style={styles.verificationImagesRow}>
                    <TouchableOpacity 
                      style={styles.verificationImageCard}
                      onPress={() => openImage(selectedRequest.idImageUrl)}
                    >
                      <Ionicons name="card" size={30} color="#FFD700" />
                      <Text style={styles.verificationImageLabel}>National ID</Text>
                      <Text style={styles.verificationImageHint}>Tap to view</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.verificationImageCard}
                      onPress={() => openImage(selectedRequest.selfieImageUrl)}
                    >
                      <Ionicons name="person" size={30} color="#FFD700" />
                      <Text style={styles.verificationImageLabel}>User Photo</Text>
                      <Text style={styles.verificationImageHint}>Tap to view</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedRequest.status === 'pending' && (
                    <View style={styles.verificationDetailActions}>
                      <TouchableOpacity 
                        style={[styles.verificationDetailBtn, { backgroundColor: '#ff444420' }]}
                        onPress={() => {
                          setDetailModalVisible(false);
                          handleReject(selectedRequest.id);
                        }}
                      >
                        <Text style={[styles.verificationDetailBtnText, { color: '#ff4444' }]}>REJECT</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.verificationDetailBtn, { backgroundColor: '#4CAF5020' }]}
                        onPress={() => {
                          setDetailModalVisible(false);
                          handleApprove(selectedRequest.id);
                        }}
                      >
                        <Text style={[styles.verificationDetailBtnText, { color: '#4CAF50' }]}>APPROVE</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={{ height: 40 }} />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Admin Manage Tips Screen
function AdminTipsScreen({ navigation }) {
  const [tips, setTips] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock tips data
    setTips([
      { id: 1, home: 'Man Utd', away: 'Liverpool', prediction: 'Over 2.5', odds: '1.85', status: 'pending', tipster: 'John Tipster', date: '2026-04-10', league: 'Premier League', is_premium: true },
      { id: 2, home: 'Real Madrid', away: 'Barcelona', prediction: 'Home Win', odds: '2.10', status: 'won', tipster: 'Pro Tips', date: '2026-04-08', league: 'La Liga', is_premium: false },
      { id: 3, home: 'Bayern', away: 'Dortmund', prediction: 'BTTS Yes', odds: '1.70', status: 'lost', tipster: 'Expert Bets', date: '2026-04-05', league: 'Bundesliga', is_premium: true },
      { id: 4, home: 'Arsenal', away: 'Chelsea', prediction: 'Under 2.5', odds: '1.90', status: 'pending', tipster: 'John Tipster', date: '2026-04-12', league: 'Premier League', is_premium: false },
    ]);
  }, []);

  const deleteTip = (tipId) => {
    Alert.alert('Delete Tip', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setTips(tips.filter(t => t.id !== tipId)) }
    ]);
  };

  const updateStatus = (tipId, newStatus) => {
    setTips(tips.map(t => t.id === tipId ? { ...t, status: newStatus } : t));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return '#4CAF50';
      case 'lost': return '#ff4444';
      default: return '#FFD700';
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Manage Tips</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'won', 'lost'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tips.filter(t => filter === 'all' || t.status === filter).map((tip) => (
          <View key={tip.id} style={styles.adminTipCard}>
            <View style={styles.adminTipHeader}>
              <View style={[styles.adminTipStatus, { backgroundColor: getStatusColor(tip.status) + '20' }]}>
                <Text style={[styles.adminTipStatusText, { color: getStatusColor(tip.status) }]}>{tip.status.toUpperCase()}</Text>
              </View>
              {tip.is_premium && (
                <View style={styles.adminTipPremium}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.adminTipPremiumText}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={styles.adminTipTeams}>{tip.home} vs {tip.away}</Text>
            <Text style={styles.adminTipDetails}>Prediction: {tip.prediction} @ {tip.odds}</Text>
            <Text style={styles.adminTipMeta}>By {tip.tipster} • {tip.league} • {tip.date}</Text>
            <View style={styles.adminTipActions}>
              <TouchableOpacity style={styles.adminTipBtn} onPress={() => updateStatus(tip.id, 'won')}>
                <Text style={[styles.adminTipBtnText, { color: '#4CAF50' }]}>Won</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adminTipBtn} onPress={() => updateStatus(tip.id, 'lost')}>
                <Text style={[styles.adminTipBtnText, { color: '#ff4444' }]}>Lost</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.adminTipBtn} onPress={() => deleteTip(tip.id)}>
                <Text style={[styles.adminTipBtnText, { color: '#888' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Users Screen
function AdminUsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'subscriber', status: 'active', balance: 50, joined: '2026-01-15' },
      { id: 2, name: 'Pro Tipster', email: 'tipster@example.com', role: 'tipster', status: 'active', balance: 450, joined: '2026-02-01' },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'subscriber', status: 'inactive', balance: 0, joined: '2026-03-10' },
      { id: 4, name: 'Expert Bets', email: 'expert@example.com', role: 'tipster', status: 'active', balance: 1200, joined: '2026-01-20' },
      { id: 5, name: 'Mike Johnson', email: 'mike@example.com', role: 'subscriber', status: 'banned', balance: 0, joined: '2026-02-28' },
    ]);
  }, []);

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ff4444';
      case 'tipster': return '#2196F3';
      default: return '#4CAF50';
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Manage Users</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.filterContainer}>
        {['all', 'subscriber', 'tipster', 'admin'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {users.filter(u => filter === 'all' || u.role === filter).map((user) => (
          <View key={user.id} style={styles.adminUserCard}>
            <View style={styles.adminUserHeader}>
              <View style={styles.adminUserInfo}>
                <Text style={styles.adminUserName}>{user.name}</Text>
                <Text style={styles.adminUserEmail}>{user.email}</Text>
              </View>
              <View style={[styles.adminUserRole, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                <Text style={[styles.adminUserRoleText, { color: getRoleColor(user.role) }]}>{user.role.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.adminUserStats}>
              <Text style={styles.adminUserStat}>Balance: Tshs {user.balance}</Text>
              <Text style={styles.adminUserStat}>Joined: {user.joined}</Text>
            </View>
            <View style={styles.adminUserActions}>
              <TouchableOpacity 
                style={[styles.adminUserBtn, { backgroundColor: user.status === 'active' ? '#ff444420' : '#4CAF5020' }]}
                onPress={() => toggleUserStatus(user.id)}
              >
                <Text style={[styles.adminUserBtnText, { color: user.status === 'active' ? '#ff4444' : '#4CAF50' }]}>
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Subscriptions Screen
function AdminSubscriptionsScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    setSubscriptions([
      { id: 1, user: 'John Doe', plan: 'Monthly', price: 29.99, status: 'active', startDate: '2026-04-01', endDate: '2026-05-01' },
      { id: 2, user: 'Jane Smith', plan: 'Weekly', price: 9.99, status: 'expired', startDate: '2026-03-20', endDate: '2026-03-27' },
      { id: 3, user: 'Mike Johnson', plan: 'Yearly', price: 149.99, status: 'active', startDate: '2026-01-10', endDate: '2027-01-10' },
      { id: 4, user: 'Sarah Lee', plan: 'Daily', price: 2.99, status: 'active', startDate: '2026-04-08', endDate: '2026-04-09' },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Subscriptions</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subscriptions.map((sub) => (
          <View key={sub.id} style={styles.adminSubCard}>
            <View style={styles.adminSubHeader}>
              <Text style={styles.adminSubUser}>{sub.user}</Text>
              <View style={[styles.adminSubStatus, { backgroundColor: sub.status === 'active' ? '#4CAF5020' : '#ff444420' }]}>
                <Text style={[styles.adminSubStatusText, { color: sub.status === 'active' ? '#4CAF50' : '#ff4444' }]}>{sub.status.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.adminSubDetails}>
              <Text style={styles.adminSubPlan}>{sub.plan} Plan</Text>
              <Text style={styles.adminSubPrice}>Tshs {sub.price}</Text>
            </View>
            <Text style={styles.adminSubDates}>From {sub.startDate} to {sub.endDate}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Payments/Withdrawals Screen
function AdminPaymentsScreen({ navigation }) {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    setWithdrawals([
      { id: 1, user: 'Pro Tipster', amount: 200, method: 'Bank Transfer', status: 'pending', date: '2026-04-08' },
      { id: 2, user: 'Expert Bets', amount: 500, method: 'M-Pesa', status: 'completed', date: '2026-04-07' },
      { id: 3, user: 'Pro Tipster', amount: 150, method: 'Bank Transfer', status: 'processing', date: '2026-04-06' },
      { id: 4, user: 'John Tipster', amount: 100, method: 'PayPal', status: 'pending', date: '2026-04-05' },
    ]);
  }, []);

  const processWithdrawal = (id, action) => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: action } : w));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'processing': return '#2196F3';
      case 'rejected': return '#ff4444';
      default: return '#FF9800';
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Withdrawals</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {withdrawals.map((w) => (
          <View key={w.id} style={styles.adminWithdrawalCard}>
            <View style={styles.adminWithdrawalHeader}>
              <Text style={styles.adminWithdrawalUser}>{w.user}</Text>
              <View style={[styles.adminWithdrawalStatus, { backgroundColor: getStatusColor(w.status) + '20' }]}>
                <Text style={[styles.adminWithdrawalStatusText, { color: getStatusColor(w.status) }]}>{w.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.adminWithdrawalAmount}>Tshs {w.amount}</Text>
            <Text style={styles.adminWithdrawalMethod}>{w.method} • {w.date}</Text>
            {w.status === 'pending' && (
              <View style={styles.adminWithdrawalActions}>
                <TouchableOpacity style={styles.adminWithdrawalBtn} onPress={() => processWithdrawal(w.id, 'completed')}>
                  <Text style={[styles.adminWithdrawalBtnText, { color: '#4CAF50' }]}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.adminWithdrawalBtn} onPress={() => processWithdrawal(w.id, 'rejected')}>
                  <Text style={[styles.adminWithdrawalBtnText, { color: '#ff4444' }]}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Settings Screen
function AdminSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    defaultTipOdds: '1.80',
    commissionRate: '10',
  });

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminScreenHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.adminScreenTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>GENERAL SETTINGS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Maintenance Mode</Text>
              <Text style={styles.settingDesc}>Put app in maintenance mode</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggle, settings.maintenanceMode && styles.toggleActive]}
              onPress={() => toggleSetting('maintenanceMode')}
            >
              <View style={[styles.toggleCircle, settings.maintenanceMode && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
          <View style={styles.settingDivider} />
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Allow Registration</Text>
              <Text style={styles.settingDesc}>Enable new user registration</Text>
            </View>
            <TouchableOpacity 
              style={[styles.toggle, settings.allowRegistration && styles.toggleActive]}
              onPress={() => toggleSetting('allowRegistration')}
            >
              <View style={[styles.toggleCircle, settings.allowRegistration && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>TIP SETTINGS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Default Minimum Odds</Text>
              <Text style={styles.settingDesc}>Minimum odds for tips</Text>
            </View>
            <TextInput 
              style={styles.settingInput}
              value={settings.defaultTipOdds}
              onChangeText={(text) => setSettings({ ...settings, defaultTipOdds: text })}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.settingDivider} />
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Commission Rate (%)</Text>
              <Text style={styles.settingDesc}>Percentage taken from tipsters</Text>
            </View>
            <TextInput 
              style={styles.settingInput}
              value={settings.commissionRate}
              onChangeText={(text) => setSettings({ ...settings, commissionRate: text })}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>SYSTEM</Text>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingDesc}>Clear app cache data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Backup Database</Text>
              <Text style={styles.settingDesc}>Export database backup</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: '#ff4444' }]}>Reset All Data</Text>
              <Text style={styles.settingDesc}>Clear all app data</Text>
            </View>
            <Ionicons name="warning" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Dashboard Screen
function AdminDashboardScreen({ navigation }) {
  const { user, signOut } = React.useContext(AuthContext);

  const stats = [
    { label: 'Total Users', value: '1,234', icon: 'people', color: '#4CAF50', screen: 'AdminUsers' },
    { label: 'Active Subs', value: '567', icon: 'star', color: '#FFD700', screen: 'AdminSubscriptions' },
    { label: 'Today Tips', value: '12', icon: 'football', color: '#2196F3', screen: 'AdminTips' },
    { label: 'Pending W/D', value: '8', icon: 'time', color: '#FF9800', screen: 'AdminPayments' },
  ];

  const quickActions = [
    { id: 'tips', icon: 'football', title: 'Manage Tips', screen: 'AdminTips', color: '#2196F3' },
    { id: 'users', icon: 'people', title: 'Users', screen: 'AdminUsers', color: '#4CAF50' },
    { id: 'subscriptions', icon: 'card', title: 'Subscriptions', screen: 'AdminSubscriptions', color: '#FFD700' },
    { id: 'payments', icon: 'wallet', title: 'Payments', screen: 'AdminPayments', color: '#9C27B0' },
    { id: 'verification', icon: 'shield-checkmark', title: 'Verification', screen: 'AdminVerification', color: '#2196F3' },
    { id: 'settings', icon: 'settings', title: 'Settings', screen: 'AdminSettings', color: '#666' },
  ];

  const recentActivity = [
    { id: 1, title: 'New user registration', desc: 'John Doe joined as subscriber', time: '2 min ago', icon: 'person-add', color: '#4CAF50' },
    { id: 2, title: 'Withdrawal request', desc: 'Pro Tipster requested Tshs 200', time: '15 min ago', icon: 'cash', color: '#FF9800' },
    { id: 3, title: 'New subscription', desc: 'Jane Smith subscribed to Monthly', time: '1 hour ago', icon: 'star', color: '#FFD700' },
    { id: 4, title: 'Tip result updated', desc: 'Man Utd vs Liverpool marked as Won', time: '2 hours ago', icon: 'trophy', color: '#2196F3' },
    { id: 5, title: 'User banned', desc: 'Mike Johnson account suspended', time: '3 hours ago', icon: 'ban', color: '#ff4444' },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.adminHeader}>
        <View style={styles.adminHeaderLeft}>
          <Ionicons name="shield-checkmark" size={30} color="#FFD700" />
          <View style={styles.adminHeaderText}>
            <Text style={styles.adminTitle}>Admin Panel</Text>
            <Text style={styles.adminSubtitle}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.adminLogoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.statCard}
              onPress={() => navigation.navigate(stat.screen)}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statCardValue}>{stat.value}</Text>
              <Text style={styles.statCardLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.adminQuickActionsGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.adminQuickActionItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.adminQuickActionIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.adminQuickActionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
        <View style={styles.activityList}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                <Ionicons name={activity.icon} size={20} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.desc}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Admin Stack Navigator
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <AdminStack.Screen name="AdminTips" component={AdminTipsScreen} />
      <AdminStack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <AdminStack.Screen name="AdminSubscriptions" component={AdminSubscriptionsScreen} />
      <AdminStack.Screen name="AdminPayments" component={AdminPaymentsScreen} />
      <AdminStack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <AdminStack.Screen name="AdminVerification" component={AdminVerificationScreen} />
    </AdminStack.Navigator>
  );
}

// Tipster Post Tip Screen
function PostTipScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const { addNotification } = React.useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simplified form - focused on booking codes
  const [formData, setFormData] = useState({
    title: '', // Brief title for the tip
    description: '', // Optional description
    totalOdds: '', // Total number of odds
    isPremium: false,
    // VIP Tip fields
    customPrice: '',
    bookingCodes: [{ company: '', code: '' }],
  });

  const bettingCompanies = [
    '1xBet', 'Betway', 'SportPesa', 'Bet365', 'Betika', 
    'Odibets', '22Bet', 'MelBet', 'SportyBet', 'Other'
  ];

  const addBookingCode = () => {
    setFormData({
      ...formData,
      bookingCodes: [...formData.bookingCodes, { company: '', code: '' }]
    });
  };

  const removeBookingCode = (index) => {
    const newBookingCodes = formData.bookingCodes.filter((_, i) => i !== index);
    setFormData({ ...formData, bookingCodes: newBookingCodes });
  };

  const updateBookingCode = (index, field, value) => {
    const newBookingCodes = formData.bookingCodes.map((code, i) => 
      i === index ? { ...code, [field]: value } : code
    );
    setFormData({ ...formData, bookingCodes: newBookingCodes });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title || !formData.totalOdds) {
      Alert.alert('Error', 'Please fill in title and total odds');
      return;
    }

    // Validate booking codes
    const validBookingCodes = formData.bookingCodes.filter(bc => bc.company && bc.code);
    if (validBookingCodes.length === 0) {
      Alert.alert('Error', 'Please add at least one booking code');
      return;
    }

    // Validate VIP tip fields if premium
    if (formData.isPremium) {
      if (!formData.customPrice || parseFloat(formData.customPrice) <= 0) {
        Alert.alert('Error', 'Please enter a valid price for this VIP tip');
        return;
      }
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://YOUR_API/api/tips', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({
      //     title: formData.title,
      //     description: formData.description,
      //     total_odds: parseFloat(formData.totalOdds),
      //     is_premium: formData.isPremium,
      //     custom_price: formData.isPremium ? parseFloat(formData.customPrice) : null,
      //     booking_codes: validBookingCodes,
      //     tipster_id: user?.id,
      //   }),
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add notification for all app users about new tip
      addNotification({
        id: Date.now(),
        title: formData.isPremium ? '🔥 New VIP Tip Available!' : '✅ New Free Tip Posted!',
        message: `${user?.name || 'A tipster'} posted: ${formData.title} (${formData.totalOdds} odds)`,
        type: 'tip',
        timestamp: new Date(),
      });

      // TODO: Send push notification to all users via backend
      // await fetch('http://YOUR_API/api/notifications/broadcast', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title: formData.isPremium ? 'New VIP Tip!' : 'New Free Tip!',
      //     body: `${formData.title} - ${formData.totalOdds} odds`,
      //     type: 'new_tip',
      //   }),
      // });

      Alert.alert(
        'Success!',
        formData.isPremium 
          ? 'Your VIP tip has been posted! Users will be notified.' 
          : 'Your tip has been posted! All users will be notified.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to post tip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsterHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tipsterHeaderTitle}>Post New Tip</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tip Info */}
        <Text style={styles.sectionLabel}>TIP INFORMATION</Text>
        
        <Text style={styles.formLabel}>Tip Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Weekend Mega Jackpot, Daily Sure Odds"
          placeholderTextColor="#666"
          value={formData.title}
          onChangeText={(text) => setFormData({...formData, title: text})}
        />
        <Text style={styles.vipPriceNote}>Give your tip a catchy name</Text>

        <Text style={styles.formLabel}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Brief description of this tip..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
        />

        <Text style={styles.formLabel}>Total Odds *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 15.5"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
          value={formData.totalOdds}
          onChangeText={(text) => setFormData({...formData, totalOdds: text})}
        />

        {/* Booking Codes Section - Required for all tips */}
        <Text style={styles.sectionLabel}>BOOKING CODES *</Text>
        <Text style={styles.bookingCodesHelp}>Add booking codes from betting companies</Text>
        
        {formData.bookingCodes.map((bookingCode, index) => (
          <View key={index} style={styles.bookingCodeRow}>
            <View style={styles.bookingCodeCompany}>
              <TextInput
                style={[styles.input, styles.bookingCodeInput]}
                placeholder="Company (e.g. 1xBet)"
                placeholderTextColor="#666"
                value={bookingCode.company}
                onChangeText={(text) => updateBookingCode(index, 'company', text)}
              />
            </View>
            <View style={styles.bookingCodeValue}>
              <TextInput
                style={[styles.input, styles.bookingCodeInput]}
                placeholder="Booking Code"
                placeholderTextColor="#666"
                value={bookingCode.code}
                onChangeText={(text) => updateBookingCode(index, 'code', text)}
              />
            </View>
            {formData.bookingCodes.length > 1 && (
              <TouchableOpacity 
                style={styles.removeBookingCodeBtn}
                onPress={() => removeBookingCode(index)}
              >
                <Ionicons name="close-circle" size={28} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        <TouchableOpacity style={styles.addBookingCodeBtn} onPress={addBookingCode}>
          <Ionicons name="add-circle" size={20} color="#FFD700" />
          <Text style={styles.addBookingCodeText}>Add Another Booking Code</Text>
        </TouchableOpacity>

        {/* Premium Toggle */}
        <View style={styles.premiumContainer}>
          <View style={styles.premiumTextContainer}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.premiumTitle}>VIP Tip</Text>
              <Text style={styles.premiumSubtitle}>Users pay to access this tip</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggle, formData.isPremium && styles.toggleActive]}
            onPress={() => setFormData({...formData, isPremium: !formData.isPremium})}
          >
            <View style={[styles.toggleCircle, formData.isPremium && styles.toggleCircleActive]} />
          </TouchableOpacity>
        </View>

        {/* VIP Price Field */}
        {formData.isPremium && (
          <>
            <Text style={styles.sectionLabel}>VIP PRICE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5000"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              value={formData.customPrice}
              onChangeText={(text) => setFormData({...formData, customPrice: text})}
            />
            <Text style={styles.vipPriceNote}>Set your custom price in Tshs</Text>
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="add-circle" size={22} color="#000" />
              <Text style={styles.submitButtonText}>POST TIP</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Tipster My Tips Screen
function MyTipsScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTips();
  }, [filter]);

  const loadTips = async () => {
    setIsLoading(true);
    // TODO: Replace with actual API call
    // const response = await fetch(`http://YOUR_API/api/my-tips?status=${filter}`, {...});
    
    // Mock data with simplified booking code format
    const mockTips = [
      {
        id: 1,
        title: 'Weekend Mega Jackpot',
        description: 'Best picks for this weekend',
        total_odds: '25.5',
        status: 'pending',
        is_premium: true,
        custom_price: 5000,
        views: 156,
        created_at: '2026-04-11 10:00:00',
        booking_codes: [
          { company: '1xBet', code: 'ABC123XYZ' },
          { company: 'Betway', code: 'BW789VIP' },
        ],
      },
      {
        id: 2,
        title: 'Daily Sure Odds',
        description: 'Guaranteed win picks',
        total_odds: '3.5',
        status: 'won',
        is_premium: false,
        views: 234,
        created_at: '2026-04-10 08:00:00',
        booking_codes: [
          { company: 'SportPesa', code: 'SP12345' },
        ],
      },
      {
        id: 3,
        title: 'Champions League Special',
        description: 'UCL midweek matches',
        total_odds: '12.8',
        status: 'lost',
        is_premium: true,
        custom_price: 3000,
        views: 189,
        created_at: '2026-04-09 14:00:00',
        booking_codes: [
          { company: 'Betika', code: 'BTKCL2026' },
          { company: 'Odibets', code: 'ODICLUB' },
        ],
      },
    ];
    
    setTimeout(() => {
      setTips(mockTips);
      setIsLoading(false);
    }, 1000);
  };

  const updateTipStatus = async (tipId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`http://YOUR_API/api/tips/${tipId}/result`, {...});
      
      setTips(tips.map(tip => 
        tip.id === tipId ? { ...tip, status: newStatus } : tip
      ));
      
      Alert.alert('Success', `Tip marked as ${newStatus.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update tip status');
    }
  };

  const deleteTip = (tipId) => {
    Alert.alert(
      'Delete Tip',
      'Are you sure you want to delete this tip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setTips(tips.filter(tip => tip.id !== tipId));
          }
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return '#4CAF50';
      case 'lost': return '#ff4444';
      case 'pending': return '#FFD700';
      default: return '#888';
    }
  };

  const renderTip = (tip) => (
    <View key={tip.id} style={styles.myTipCard}>
      <View style={styles.myTipHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tip.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(tip.status) }]}>
            {tip.status.toUpperCase()}
          </Text>
        </View>
        {tip.is_premium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.premiumBadgeText}>VIP</Text>
          </View>
        )}
      </View>

      {/* Tip Title & Description */}
      <Text style={styles.myTipTitle}>{tip.title}</Text>
      {tip.description && (
        <Text style={styles.myTipDescription} numberOfLines={2}>{tip.description}</Text>
      )}
      
      {/* Total Odds */}
      <View style={styles.myTipOddsRow}>
        <Ionicons name="trending-up" size={18} color="#FFD700" />
        <Text style={styles.myTipTotalOdds}>Total Odds: {tip.total_odds}</Text>
      </View>
      
      <Text style={styles.myTipDate}>Posted: {new Date(tip.created_at).toLocaleDateString()}</Text>
      
      {/* Price & Booking Codes */}
      <View style={styles.myTipVipInfo}>
        {tip.is_premium && (
          <View style={styles.myTipPriceRow}>
            <Ionicons name="cash-outline" size={16} color="#4CAF50" />
            <Text style={styles.myTipPriceText}>{tip.custom_price?.toLocaleString()} Tshs</Text>
          </View>
        )}
        
        {/* Booking Codes - Show for all tips */}
        {tip.booking_codes && tip.booking_codes.length > 0 && (
          <View style={styles.myTipBookingCodes}>
            <Text style={styles.myTipBookingCodesTitle}>Booking Codes:</Text>
            {tip.booking_codes.map((code, index) => (
              <View key={index} style={styles.myTipBookingCodeRow}>
                <View style={styles.myTipCompanyBadge}>
                  <Text style={styles.myTipCompanyText}>{code.company}</Text>
                </View>
                <Text style={styles.myTipCodeText}>{code.code}</Text>
                <TouchableOpacity 
                  onPress={() => Alert.alert('Copied!', `${code.code} copied to clipboard`)}
                  style={styles.myTipCopyBtn}
                >
                  <Ionicons name="copy-outline" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={styles.myTipStats}>
        <View style={styles.myTipStat}>
          <Ionicons name="eye" size={16} color="#888" />
          <Text style={styles.myTipStatText}>{tip.views} views</Text>
        </View>
      </View>

      {tip.status === 'pending' && (
        <View style={styles.myTipActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4CAF5020' }]}
            onPress={() => updateTipStatus(tip.id, 'won')}
          >
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Mark Won</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#ff444420' }]}
            onPress={() => updateTipStatus(tip.id, 'lost')}
          >
            <Ionicons name="close-circle" size={20} color="#ff4444" />
            <Text style={[styles.actionButtonText, { color: '#ff4444' }]}>Mark Lost</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#88888820' }]}
            onPress={() => deleteTip(tip.id)}
          >
            <Ionicons name="trash" size={20} color="#888" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsterHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tipsterHeaderTitle}>My Tips</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PostTip')}>
          <Ionicons name="add-circle" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'won', 'lost'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {tips.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="football-outline" size={60} color="#444" />
              <Text style={styles.emptyStateText}>No tips found</Text>
              <Text style={styles.emptyStateSubtext}>Start posting tips to see them here</Text>
            </View>
          ) : (
            tips.map(renderTip)
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Notifications Screen
function NotificationsScreen({ navigation }) {
  const { notifications, clearNotification, clearAllNotifications } = React.useContext(NotificationContext);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tip': return 'football';
      case 'subscription': return 'card';
      case 'withdrawal': return 'cash';
      default: return 'notifications';
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsterHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tipsterHeaderTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={60} color="#444" />
            <Text style={styles.emptyStateText}>No notifications</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationCard}
              onPress={() => clearNotification(notification.id)}
            >
              <View style={[styles.notificationIcon, { backgroundColor: '#FFD70020' }]}>
                <Ionicons name={getNotificationIcon(notification.type)} size={24} color="#FFD700" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </Text>
              </View>
              <TouchableOpacity onPress={() => clearNotification(notification.id)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Tipster Stack Navigator
function TipsterStackScreen() {
  return (
    <TipsterStack.Navigator screenOptions={{ headerShown: false }}>
      <TipsterStack.Screen name="TipsterMain" component={TipsterTabNavigator} />
      <TipsterStack.Screen name="PostTip" component={PostTipScreen} />
      <TipsterStack.Screen name="MyTips" component={MyTipsScreen} />
      <TipsterStack.Screen name="Notifications" component={NotificationsScreen} />
      <TipsterStack.Screen name="VerificationApply" component={VerificationApplicationScreen} />
    </TipsterStack.Navigator>
  );
}

// Tipster Home Dashboard Screen
function TipsterHomeScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const { notifications } = React.useContext(NotificationContext);

  const stats = [
    { label: 'Total Tips', value: '45', icon: 'football', color: '#4CAF50' },
    { label: 'Win Rate', value: '68%', icon: 'trending-up', color: '#2196F3' },
    { label: 'Followers', value: '1.2K', icon: 'people', color: '#9C27B0' },
    { label: 'Earnings', value: 'Tshs 450', icon: 'cash', color: '#FFD700' },
  ];

  const recentActivity = [
    { id: 1, type: 'tip', title: 'Posted new tip', desc: 'Man Utd vs Liverpool - Over 2.5', time: '2 min ago' },
    { id: 2, type: 'win', title: 'Tip Won!', desc: 'Real Madrid vs Barcelona - Home Win', time: '1 hour ago' },
    { id: 3, type: 'follower', title: 'New Follower', desc: 'John Doe started following you', time: '3 hours ago' },
    { id: 4, type: 'tip', title: 'Posted new tip', desc: 'Bayern vs Dortmund - BTTS Yes', time: '5 hours ago' },
  ];

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.tipsterHomeHeader}>
          <View>
            <Text style={styles.tipsterHomeGreeting}>Hello, {user?.name?.split(' ')[0] || 'Tipster'}</Text>
            <Text style={styles.tipsterHomeSubtext}>Ready to share your predictions?</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications" size={24} color="#FFD700" />
            {notifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Action - Post New Tip */}
        <TouchableOpacity 
          style={styles.postTipQuickAction}
          onPress={() => navigation.navigate('PostTip')}
        >
          <View style={styles.postTipIconContainer}>
            <Ionicons name="add-circle" size={40} color="#000" />
          </View>
          <View style={styles.postTipTextContainer}>
            <Text style={styles.postTipTitle}>Post New Tip</Text>
            <Text style={styles.postTipSubtitle}>Share your prediction with followers</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statCardValue}>{stat.value}</Text>
              <Text style={styles.statCardLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('MyTips')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F320' }]}>
              <Ionicons name="list" size={28} color="#2196F3" />
            </View>
            <Text style={styles.quickActionText}>My Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('PostTip')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF5020' }]}>
              <Ionicons name="add" size={28} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>New Tip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFD70020' }]}>
              <Ionicons name="analytics" size={28} color="#FFD700" />
            </View>
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B020' }]}>
              <Ionicons name="wallet" size={28} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
        <View style={styles.activityList}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { 
                backgroundColor: 
                  activity.type === 'win' ? '#4CAF5020' : 
                  activity.type === 'follower' ? '#9C27B020' : '#FFD70020'
              }]}>
                <Ionicons 
                  name={
                    activity.type === 'win' ? 'trophy' : 
                    activity.type === 'follower' ? 'person-add' : 'football'
                  } 
                  size={20} 
                  color={
                    activity.type === 'win' ? '#4CAF50' : 
                    activity.type === 'follower' ? '#9C27B0' : '#FFD700'
                  } 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.desc}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pending Tips Section */}
        <Text style={styles.sectionLabel}>PENDING RESULTS</Text>
        <View style={styles.pendingTipsContainer}>
          <View style={styles.pendingTipCard}>
            <View style={styles.pendingTipHeader}>
              <Text style={styles.pendingTipTeams}>Arsenal vs Chelsea</Text>
              <Text style={styles.pendingTipTime}>Today, 20:00</Text>
            </View>
            <Text style={styles.pendingTipPrediction}>Prediction: Home Win (1.95)</Text>
            <View style={styles.pendingTipActions}>
              <TouchableOpacity style={styles.pendingTipButton}>
                <Text style={styles.pendingTipButtonText}>Update Result</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Tipster Recent Tips Screen
function RecentTipsScreen() {
  const [tips, setTips] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with API call
    const mockTips = [
      { id: 1, home: 'Man Utd', away: 'Liverpool', prediction: 'Over 2.5', odds: '1.85', status: 'pending', time: '2 hours ago', league: 'Premier League' },
      { id: 2, home: 'Real Madrid', away: 'Barcelona', prediction: 'Home Win', odds: '2.10', status: 'won', time: '5 hours ago', league: 'La Liga' },
      { id: 3, home: 'Bayern', away: 'Dortmund', prediction: 'BTTS Yes', odds: '1.70', status: 'lost', time: '1 day ago', league: 'Bundesliga' },
      { id: 4, home: 'Juventus', away: 'AC Milan', prediction: 'Under 2.5', odds: '1.90', status: 'pending', time: '1 day ago', league: 'Serie A' },
    ];
    setTips(mockTips);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return '#4CAF50';
      case 'lost': return '#ff4444';
      default: return '#FFD700';
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.tipsterHeader}>
        <Text style={styles.tipsterHeaderTitle}>Recent Tips</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'won', 'lost'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tips
          .filter(tip => filter === 'all' || tip.status === filter)
          .map((tip) => (
            <View key={tip.id} style={styles.recentTipCard}>
              <View style={styles.recentTipHeader}>
                <Text style={styles.recentTipLeague}>{tip.league}</Text>
                <View style={[styles.recentTipStatus, { backgroundColor: getStatusColor(tip.status) + '20' }]}>
                  <Text style={[styles.recentTipStatusText, { color: getStatusColor(tip.status) }]}>
                    {tip.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.recentTipTeams}>{tip.home} vs {tip.away}</Text>
              <View style={styles.recentTipFooter}>
                <Text style={styles.recentTipPrediction}>{tip.prediction} @ {tip.odds}</Text>
                <Text style={styles.recentTipTime}>{tip.time}</Text>
              </View>
            </View>
          ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Client Dashboard Screen (Main App)
function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tipsters') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'VIP Tips') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'My Tips') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={focused ? size + 8 : size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#111',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Tipsters" component={TipstersScreen} />
      <Tab.Screen name="VIP Tips" component={VIPTipsScreen} />
      <Tab.Screen name="My Tips" component={TipsHistoryScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// Tipster Tab Navigator (Custom tabs for tipsters)
function TipsterTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recent Tips') {
            iconName = focused ? 'football' : 'football-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={focused ? size + 8 : size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={TipsterHomeScreen} />
      <Tab.Screen name="Recent Tips" component={RecentTipsScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackScreen}
      />
    </Tab.Navigator>
  );
}

// Root Navigator - handles role-based routing
function RootNavigator({ userToken, userRole }) {
  if (!userToken) {
    // Not logged in - show auth flow
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Login" component={LoginScreen} />
        <ProfileStack.Screen name="Register" component={RegisterScreen} />
      </ProfileStack.Navigator>
    );
  }

  // Logged in - check role and redirect accordingly
  if (userRole === 'admin') {
    // Admin user - show admin stack
    return <AdminStackScreen />;
  } else if (userRole === 'tipster') {
    // Tipster user - show main app with tipster features
    return <TipsterStackScreen />;
  } else {
    // Subscriber user - show main app
    return <ClientNavigator />;
  }
}

// Main App Component with Auth Provider
export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            userRole: action.role,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userRole: action.role,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userRole: null,
            user: null,
          };
        case 'SET_USER':
          return {
            ...prevState,
            user: action.user,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userRole: null,
      user: null,
    }
  );

  useEffect(() => {
    // Check for stored token on app load
    const bootstrapAsync = async () => {
      let userToken = null;
      let userRole = null;
      try {
        // TODO: Load token and role from SecureStore or AsyncStorage
        // userToken = await SecureStore.getItemAsync('userToken');
        // userRole = await SecureStore.getItemAsync('userRole');
      } catch (e) {
        console.log('Failed to load token');
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, role: userRole });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        try {
          // For testing without backend - mock login
          // Remove this block when connecting to real API
          if (data.email === 'beast@gmail.com' && data.password === 'beast123') {
            const mockUser = {
              id: 1,
              name: 'Beast Admin',
              email: 'beast@gmail.com',
              role: 'admin',
              phone: '+255123456789',
            };
            const mockToken = 'admin-token-' + Date.now();
            
            dispatch({ type: 'SIGN_IN', token: mockToken, role: 'admin', user: mockUser });
            return { success: true, role: 'admin' };
          }
          
          if (data.email === 'tipster@test.com' && data.password === 'tipster123') {
            const mockUser = {
              id: 2,
              name: 'Pro Tipster',
              email: 'tipster@test.com',
              role: 'tipster',
              phone: '+255987654321',
              verified: false, // Not verified yet
            };
            const mockToken = 'tipster-token-' + Date.now();
            
            dispatch({ type: 'SIGN_IN', token: mockToken, role: 'tipster', user: mockUser });
            return { success: true, role: 'tipster' };
          }
          
          if (data.email === 'verified@test.com' && data.password === 'verified123') {
            const mockUser = {
              id: 4,
              name: 'Verified Expert',
              email: 'verified@test.com',
              role: 'tipster',
              phone: '+255999888777',
              verified: true, // Verified tipster
            };
            const mockToken = 'verified-token-' + Date.now();
            
            dispatch({ type: 'SIGN_IN', token: mockToken, role: 'tipster', user: mockUser });
            return { success: true, role: 'tipster' };
          }
          
          if (data.email === 'user@test.com' && data.password === 'user123') {
            const mockUser = {
              id: 3,
              name: 'John User',
              email: 'user@test.com',
              role: 'subscriber',
              phone: '+255111222333',
            };
            const mockToken = 'user-token-' + Date.now();
            
            dispatch({ type: 'SIGN_IN', token: mockToken, role: 'subscriber', user: mockUser });
            return { success: true, role: 'subscriber' };
          }
          
          // Real API call - Uncomment when backend is ready
          // const API_URL = 'http://YOUR_API_IP:8000/api';
          // const response = await fetch(`${API_URL}/login`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(data),
          // });
          // 
          // const result = await response.json();
          // 
          // if (!response.ok) {
          //   throw new Error(result.message || 'Login failed');
          // }
          // 
          // const { user, token } = result;
          // dispatch({ type: 'SIGN_IN', token: token, role: user.role, user: user });
          // return { success: true, role: user.role };
          
          throw new Error('Invalid credentials. Try: beast@gmail.com / beast123 (admin)');
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      signOut: async () => {
        try {
          // TODO: Remove stored token and role
          // await SecureStore.deleteItemAsync('userToken');
          // await SecureStore.deleteItemAsync('userRole');
          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      signUp: async (data) => {
        try {
          // Mock registration - creates a subscriber
          const mockUser = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            role: 'subscriber',
            phone: data.phone,
          };
          const mockToken = 'user-token-' + Date.now();
          
          // Store token and role securely
          // await SecureStore.setItemAsync('userToken', token);
          // await SecureStore.setItemAsync('userRole', user.role);
          
          dispatch({ type: 'SIGN_IN', token: mockToken, role: 'subscriber', user: mockUser });
          
          return { success: true, role: 'subscriber' };
          
          // Real API call - Uncomment when backend is ready
          // const API_URL = 'http://YOUR_API_IP:8000/api';
          // const response = await fetch(`${API_URL}/register`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     name: data.name,
          //     email: data.email,
          //     password: data.password,
          //     password_confirmation: data.password,
          //     phone: data.phone,
          //     role: 'subscriber',
          //   }),
          // });
          // 
          // const result = await response.json();
          // 
          // if (!response.ok) {
          //   throw new Error(result.message || 'Registration failed');
          // }
          // 
          // const { user, token } = result;
          // dispatch({ type: 'SIGN_IN', token: token, role: user.role, user: user });
          // return { success: true, role: user.role };
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },
      user: state.user,
      userToken: state.userToken,
      userRole: state.userRole,
    }),
    [state.user, state.userToken, state.userRole]
  );

  // Notification state - MUST be before any early returns
  const [notifications, setNotifications] = React.useState([]);
  
  const notificationContext = React.useMemo(() => ({
    notifications,
    addNotification: (notification) => {
      setNotifications(prev => [notification, ...prev]);
    },
    clearNotification: (id) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    },
    clearAllNotifications: () => {
      setNotifications([]);
    },
  }), [notifications]);

  // VIP Access state - tracks if user has paid for VIP access
  const [hasVIPAccess, setHasVIPAccess] = React.useState(false);
  
  const vipAccessContext = React.useMemo(() => ({
    hasVIPAccess,
    setHasVIPAccess,
  }), [hasVIPAccess]);

  // Follow state - tracks which tipsters the user is following
  const [followedTipsters, setFollowedTipsters] = React.useState([]);
  
  const followContext = React.useMemo(() => ({
    followedTipsters,
    toggleFollow: (tipsterId) => {
      setFollowedTipsters(prev => 
        prev.includes(tipsterId) 
          ? prev.filter(id => id !== tipsterId)
          : [...prev, tipsterId]
      );
    },
  }), [followedTipsters]);

  // Early return for loading MUST be after all hooks
  if (state.isLoading) {
    return (
      <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NotificationContext.Provider value={notificationContext}>
        <VIPAccessContext.Provider value={vipAccessContext}>
          <FollowContext.Provider value={followContext}>
            <NavigationContainer>
              <StatusBar style="light" />
              <RootNavigator userToken={state.userToken} userRole={state.userRole} />
            </NavigationContainer>
          </FollowContext.Provider>
        </VIPAccessContext.Provider>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  packageCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  packageDivider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#ccc',
    fontSize: 15,
    marginLeft: 12,
  },
  featureHighlight: {
    color: '#fff',
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  priceLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  priceValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subscribeButton: {
    backgroundColor: '#FFD700',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  noticeText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  modalInfoSection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalLogo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  modalDescription: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBody: {
    backgroundColor: '#111',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  processingSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  formLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  amountText: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#FFD700',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  payButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 5,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  contactTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  socialIconBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#111',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  supportInfo: {
    marginTop: 40,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
  },
  supportText: {
    color: '#444',
    fontSize: 13,
    marginBottom: 5,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 10,
    paddingHorizontal: 40,
  },
  // Auth Styles
  authContainer: {
    padding: 25,
    paddingBottom: 40,
    minHeight: '100%',
  },
  authHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#FFD700',
    fontSize: 13,
  },
  authButton: {
    backgroundColor: '#FFD700',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  authFooterText: {
    color: '#888',
    fontSize: 14,
  },
  authFooterLink: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  termsText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  termsLink: {
    color: '#FFD700',
  },
  demoCredentials: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  demoTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  // Profile Styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  profileBadge: {
    backgroundColor: '#FFD70020',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  profileBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#222',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff444420',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ff444440',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  appVersion: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  // Admin Dashboard Styles
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  adminHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminHeaderText: {
    marginLeft: 15,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  adminSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  adminLogoutBtn: {
    padding: 8,
    backgroundColor: '#ff444420',
    borderRadius: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statCardLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 5,
  },
  adminMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adminMenuItem: {
    width: '31%',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  adminMenuItemActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD70010',
  },
  adminMenuText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  adminMenuTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#fff',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  // Tipster Screen Styles
  tipsterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tipsterHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  oddsTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  oddsTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
    marginBottom: 10,
  },
  oddsTypeButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD70020',
  },
  oddsTypeText: {
    color: '#888',
    fontSize: 13,
  },
  oddsTypeTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  confidenceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 5,
  },
  confidenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  confidenceText: {
    color: '#888',
    fontSize: 14,
  },
  premiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  premiumTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#FFD700',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleCircleActive: {
    transform: [{ translateX: 22 }],
  },
  submitButton: {
    backgroundColor: '#FFD700',
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 8,
  },
  // My Tips Screen Styles
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: '#FFD70020',
  },
  filterTabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  myTipCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  myTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  myTipTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  myTipPrediction: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 4,
  },
  myTipOdds: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  myTipDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  myTipStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  myTipStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  myTipStatText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 5,
  },
  myTipActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 18,
    marginTop: 15,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  // Notifications Styles
  clearAllText: {
    color: '#ff4444',
    fontSize: 14,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  notificationIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  notificationMessage: {
    color: '#888',
    fontSize: 13,
    marginBottom: 3,
  },
  notificationTime: {
    color: '#666',
    fontSize: 11,
  },
  // Menu Item Badge
  menuItemHighlight: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  menuBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  // Tipster Home Screen Styles
  tipsterHomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipsterHomeGreeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  tipsterHomeSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  postTipQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  postTipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTipTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  postTipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  postTipSubtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionItem: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDesc: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  pendingTipsContainer: {
    marginBottom: 20,
  },
  pendingTipCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  pendingTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pendingTipTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pendingTipTime: {
    fontSize: 12,
    color: '#888',
  },
  pendingTipPrediction: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 12,
  },
  pendingTipActions: {
    flexDirection: 'row',
  },
  pendingTipButton: {
    backgroundColor: '#FFD70020',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  pendingTipButtonText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  // Recent Tips Screen Styles
  recentTipCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  recentTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTipLeague: {
    fontSize: 12,
    color: '#888',
  },
  recentTipStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recentTipStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentTipTeams: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  recentTipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTipPrediction: {
    fontSize: 14,
    color: '#FFD700',
  },
  recentTipTime: {
    fontSize: 12,
    color: '#666',
  },
  // Admin Screen Styles
  adminScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  adminScreenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminQuickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adminQuickActionItem: {
    width: '19%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  adminQuickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  adminQuickActionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  adminTipCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  adminTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminTipStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminTipStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  adminTipPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminTipPremiumText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  adminTipTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  adminTipDetails: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 3,
  },
  adminTipMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  adminTipActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  adminTipBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  adminTipBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminUserCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  adminUserHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adminUserInfo: {
    flex: 1,
  },
  adminUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminUserEmail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  adminUserRole: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminUserRoleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  adminUserStats: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  adminUserStat: {
    fontSize: 13,
    color: '#888',
    marginRight: 15,
  },
  adminUserActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  adminUserBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  adminUserBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminSubCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  adminSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminSubUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminSubStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminSubStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  adminSubDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  adminSubPlan: {
    fontSize: 15,
    color: '#FFD700',
  },
  adminSubPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  adminSubDates: {
    fontSize: 12,
    color: '#666',
  },
  adminWithdrawalCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  adminWithdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminWithdrawalUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  adminWithdrawalStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminWithdrawalStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  adminWithdrawalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  adminWithdrawalMethod: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  adminWithdrawalActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 10,
  },
  adminWithdrawalBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  adminWithdrawalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#222',
    marginHorizontal: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  settingDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  settingInput: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#fff',
    fontSize: 16,
    minWidth: 80,
    textAlign: 'center',
  },
  // Verification Badge Styles
  verificationBadge: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  verifiedBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F320',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  verifiedBadgeTextLarge: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verifiedBadgeText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  // Verification Application Styles
  verificationIntro: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  verificationBadgeLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verificationIntroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  verificationIntroText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  idUploadButton: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  idUploadButtonSuccess: {
    backgroundColor: '#4CAF5020',
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  idUploadText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  idUploadSubtext: {
    color: '#666',
    fontSize: 13,
    marginTop: 5,
  },
  verificationNote: {
    flexDirection: 'row',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  verificationNoteText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  // Admin Verification Screen Styles
  verificationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  verificationStat: {
    alignItems: 'center',
  },
  verificationStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  verificationStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  verificationRequestCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  verificationRequestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verificationRequestUser: {
    flex: 1,
  },
  verificationRequestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  verificationRequestDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  verificationRequestStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusIndicatorText: {
    fontSize: 12,
    color: '#888',
  },
  verificationRequestExpertise: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 10,
  },
  verificationRequestStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  verificationRequestStat: {
    fontSize: 13,
    color: '#888',
    marginRight: 15,
  },
  verificationRequestActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 12,
  },
  verificationActionBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  verificationActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Edit Profile Screen Styles
  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  editProfileHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profilePhotoSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profilePhotoContainer: {
    position: 'relative',
  },
  editProfileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#333',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  changePhotoText: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  sectionTabActive: {
    backgroundColor: '#FFD70020',
  },
  sectionTabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTabTextActive: {
    color: '#FFD700',
  },
  // Booking Code Styles
  vipPriceNote: {
    color: '#888',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 15,
    marginLeft: 5,
  },
  bookingCodesHelp: {
    color: '#888',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
  bookingCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingCodeCompany: {
    flex: 1.2,
    marginRight: 8,
  },
  bookingCodeValue: {
    flex: 1,
    marginRight: 8,
  },
  bookingCodeInput: {
    marginTop: 0,
  },
  removeBookingCodeBtn: {
    padding: 5,
  },
  addBookingCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginTop: 5,
  },
  addBookingCodeText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Settings Screen Styles
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  settingItemDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  // VIP Tips Screen Styles
  vipScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  vipScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  vipScreenSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  vipFilterContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 8,
    padding: 4,
  },
  vipFilterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  vipFilterBtnActive: {
    backgroundColor: '#FFD70020',
  },
  vipFilterText: {
    color: '#888',
    fontSize: 13,
  },
  vipFilterTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  verifiedBanner: {
    flexDirection: 'row',
    backgroundColor: '#2196F320',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2196F340',
  },
  verifiedBannerIcon: {
    marginRight: 12,
  },
  verifiedBannerTitle: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 14,
  },
  verifiedBannerDesc: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  vipTipCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  vipTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tipsterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsterName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
  tipsterStats: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  vipBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  vipTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  vipPrediction: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 12,
  },
  vipActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 12,
  },
  vipPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  vipPurchaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  vipPurchaseBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 6,
  },
  unlockTipPreview: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  unlockTipMatch: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  unlockTipPrediction: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  unlockNote: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
  },
  bookingCodesTipInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  bookingCodesMatch: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookingCodesPrediction: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  bookingCodesTipster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  bookingCodesBy: {
    color: '#888',
    marginRight: 6,
  },
  bookingCodeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  bookingCodeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyLogoText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingCodeValueBox: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
  },
  bookingCodeLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingCodeValue: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  copyCodeBtn: {
    padding: 8,
  },
  analysisBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
  },
  analysisText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    color: '#888',
    marginTop: 10,
  },
  verifiedFilterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipTotalOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  vipTotalOddsText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  vipPriceLabel: {
    color: '#888',
    fontSize: 12,
  },
  // My Tips VIP Info Styles
  myTipVipInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  myTipPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  myTipPriceText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  myTipBookingCodes: {
    marginTop: 5,
  },
  myTipBookingCodesTitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  myTipBookingCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  myTipCompanyBadge: {
    backgroundColor: '#FFD70020',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  myTipCompanyText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  myTipCodeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    letterSpacing: 0.5,
  },
  myTipCopyBtn: {
    padding: 6,
  },
  myTipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  myTipDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  myTipOddsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  myTipTotalOdds: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Tipsters Screen Styles
  tipstersHeader: {
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tipstersTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tipstersSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tipstersFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tipstersFilterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#111',
  },
  tipstersFilterBtnActive: {
    backgroundColor: '#FFD70020',
  },
  tipstersFilterText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  tipstersFilterTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  tipsterCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  tipsterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsterCardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipsterCardInfo: {
    flex: 1,
  },
  tipsterCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsterCardName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
  tipsterCardFollowers: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followBtnActive: {
    backgroundColor: '#333',
  },
  followBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
  },
  followBtnTextActive: {
    color: '#FFD700',
  },
  tipsterCardBio: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipsterCardStats: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
  },
  tipsterCardStat: {
    flex: 1,
    alignItems: 'center',
  },
  tipsterCardStatDivider: {
    width: 1,
    backgroundColor: '#222',
  },
  tipsterCardStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tipsterCardStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  // Tipster Profile Screen Styles
  tipsterProfileHeader: {
    padding: 20,
    paddingBottom: 0,
  },
  tipsterProfileBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsterProfileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tipsterProfileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tipsterProfileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsterProfileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  verifiedBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F320',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipsterProfileBio: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsterProfileFollowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  tipsterProfileFollowBtnActive: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  tipsterProfileFollowBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsterProfileStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsterProfileStatBox: {
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#222',
  },
  tipsterProfileStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tipsterProfileStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  tipsterWinLossContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  tipsterWinLossBar: {
    height: 8,
    backgroundColor: '#ff444420',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tipsterWinBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  tipsterWinLossLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tipsterWinLabel: {
    color: '#4CAF50',
    fontSize: 13,
  },
  tipsterLossLabel: {
    color: '#ff4444',
    fontSize: 13,
  },
  tipsterRecentTipCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  tipsterRecentTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsterRecentTipResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsterResultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  tipsterResultText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tipsterRecentTipDate: {
    fontSize: 12,
    color: '#666',
  },
  tipsterRecentTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  tipsterRecentTipOdds: {
    fontSize: 14,
    color: '#FFD700',
  },
  // Verification Detail Modal Styles
  verificationDetailHeader: {
    marginBottom: 20,
  },
  verificationDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  verificationDetailDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  verificationDetailInfo: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  verificationDetailLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  verificationDetailValue: {
    fontSize: 15,
    color: '#fff',
    marginTop: 2,
  },
  verificationDetailWhy: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  verificationImagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  verificationImageCard: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#222',
  },
  verificationImageLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  verificationImageHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  verificationDetailActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  verificationDetailBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  verificationDetailBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Help & Support Screen Styles
  helpSupportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  helpSupportHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Tips History Screen Styles
  tipsHistoryHeader: {
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tipsHistoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  tipsHistorySubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tipsHistoryFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tipsHistoryFilterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#111',
  },
  tipsHistoryFilterBtnActive: {
    backgroundColor: '#FFD70020',
  },
  tipsHistoryFilterText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  tipsHistoryFilterTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  tipsHistorySummary: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  tipsHistorySummaryText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  purchaseTipsterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseTipsterName: {
    fontSize: 14,
    color: '#888',
    marginRight: 6,
  },
  purchaseStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  purchaseStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  purchaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  purchaseDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  purchaseStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  purchaseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  purchaseStatText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  purchaseBookingCodes: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  purchaseCodesLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  purchaseCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  purchaseCompanyBadge: {
    backgroundColor: '#FFD70020',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  purchaseCompanyText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  purchaseCodeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    letterSpacing: 0.5,
  },
  // Delete Account Modal Styles
  deleteAccountWarning: {
    alignItems: 'center',
    backgroundColor: '#ff444420',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff444440',
  },
  deleteAccountWarningText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  deleteConfirmBtn: {
    backgroundColor: '#ff4444',
    height: 55,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  deleteConfirmBtnDisabled: {
    opacity: 0.7,
  },
  deleteConfirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteCancelBtn: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  deleteCancelBtnText: {
    color: '#888',
    fontSize: 16,
  },
});
