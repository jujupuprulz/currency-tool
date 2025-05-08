# 美元/台幣匯率計算器 (USD/TWD Currency Calculator)

A secure web application for calculating USD to TWD currency exchange values.

## Features

- Real-time exchange rates from ExchangeRate API
- Secure HTTPS connection
- Comprehensive security measures
- Traditional Chinese numerical formatting
- Responsive design
- Simplified number formatting

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Generate SSL certificates for local development:
   ```
   npm run generate-cert
   ```
   When prompted, you can use any information for the certificate questions.

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to `https://localhost:3000`

### Notes

- The browser may show a security warning because of the self-signed certificate. This is normal for local development.
- For production, you should use proper SSL certificates from a trusted certificate authority.

## Security Features

This application implements multiple layers of security:

### Network Security
- **HTTPS Only**: All traffic is encrypted using TLS/SSL
- **HTTP to HTTPS Redirection**: Automatically redirects insecure HTTP requests to HTTPS
- **HSTS Headers**: Strict Transport Security headers prevent downgrade attacks
- **Rate Limiting**: Prevents brute force and DDoS attacks by limiting request frequency

### Application Security
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **Input Sanitization**: All user inputs are sanitized to prevent injection attacks
- **XSS Protection**: Multiple headers and measures to prevent cross-site scripting
- **CORS Protection**: Strict Cross-Origin Resource Sharing policies
- **Clickjacking Protection**: X-Frame-Options headers prevent UI redressing attacks
- **MIME Sniffing Protection**: Prevents MIME type confusion attacks

### Data Security
- **Secure LocalStorage**: Data stored in browser is sanitized before storage
- **API Response Validation**: All API responses are validated before processing
- **No Sensitive Data**: The application doesn't handle or store sensitive personal data

### Additional Protections
- **Security Headers**: Comprehensive set of security headers
- **Proper Content Types**: All resources are served with correct MIME types
- **Cache Control**: Prevents caching of sensitive data

## Exchange Rate API

This application uses the [ExchangeRate API](https://www.exchangerate-api.com/) to fetch exchange rates. The free tier has some limitations:

- Updates once per day
- Limited to 1,500 API calls per month

### Exchange Rate Update Issue

The application now tracks when exchange rates actually change, regardless of the API's timestamp. The API currently has an issue where it reports timestamps from the future (May 2025), but the actual exchange rate data is still being updated daily.

The application implements the following solutions:

1. **Local Timestamp Tracking**: The app stores the last time it fetched data and the exchange rate value
2. **Rate Change Detection**: The app compares the current rate with the previously stored rate to detect updates
3. **User Notifications**: The app shows different status messages:
   - "匯率已更新!" (Rate has been updated!) when a rate change is detected
   - "最後檢查:" (Last checked:) when no change is detected but data is fresh
   - "匯率可能未更新" (Rate may not be updated) when no change has been detected for over 48 hours

This approach ensures users know when the exchange rate has actually changed, regardless of the API's timestamp issues.
