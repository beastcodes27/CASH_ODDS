# Cash Odds Mobile App

Cash Odds is a premium sports betting tips and prediction mobile application built with React Native and Expo.

## Backend Architecture

The application is wired to the production backend hosted at:
- **API Base URL**: `https://cashodds.devtz.com/api`
- **Host**: `cashodds.devtz.com`

### Backend Services

The app connects to the following backend services via `src/services`:
- `authService`: User registration, authentication, token management, and profile
- `tipsService`: Free and VIP tips browsing, odds calculations, and status updates
- `tipsterService`: Tipster profiles, performance tracking, follower management, and verification requests
- `paymentService`: FastLipa mobile money transactions, payment status polling, and purchase verification
- `notificationService`: Real-time push notifications and broadcast alerts
- `healthService`: Backend connectivity monitoring and health checks

## Configuration

To customize or override the backend URL locally, create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_BASE_URL=https://cashodds.devtz.com/api
EXPO_PUBLIC_API_TIMEOUT=15000
```

## Running the App

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start
```
