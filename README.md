# Multilingual FAQ System

A dynamic FAQ system built with Node.js and Express.js that supports multiple languages using Google Translate API and Redis for caching.

## Features

- RESTful API endpoints for FAQ management
- Multi-language support via Google Translate API
- High-performance caching with Redis
- Built on Express.js framework
- Easy-to-use API for creating, updating, and retrieving FAQs

## Prerequisites

Before you begin, ensure you have installed:

- Node.js (v14.0.0 or higher)
- Redis Server
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd faq-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
PORT=3000
REDIS_URL=redis://localhost:6379
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## Configuration

The system uses the following environment variables:
- `PORT`: Server port number
- `REDIS_URL`: Redis connection string
- `GOOGLE_TRANSLATE_API_KEY`: Your Google Cloud Translation API key

## Usage

1. Start the Redis server:
```bash
redis-server
```

2. Start the application:
```bash
npm start
```

## API Endpoints

### FAQ Management

- `GET /api/faqs`: Retrieve all FAQs
- `GET /api/faqs/:id`: Get a specific FAQ
- `POST /api/faqs`: Create a new FAQ
- `PUT /api/faqs/:id`: Update an existing FAQ
- `DELETE /api/faqs/:id`: Delete an FAQ

### Language Support

- `GET /api/faqs/:id/translate/:lang`: Get a translated version of an FAQ
- `GET /api/languages`: Get list of supported languages

## Request Examples

### Create a new FAQ:
```json
POST /api/faqs
{
  "question": "How do I reset my password?",
  "answer": "You can reset your password by clicking on the 'Forgot Password' link."
}
```

### Get a translated FAQ:
```
GET /api/faqs/1/translate/es
```

## Caching

The system uses Redis to cache:
- Frequently accessed FAQs
- Translated content
- API responses

Cache expiration is set to 24 hours by default.

## Project Structure

```
faq-system/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── config/
├── tests/
├── .env
└── package.json
```

## Dependencies

Major dependencies include:
- express: Web framework
- redis: Redis client
- @google-cloud/translate: Google Translate API client
- dotenv: Environment configuration
- winston: Logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
