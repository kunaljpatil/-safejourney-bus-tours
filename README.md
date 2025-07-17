# SafeJourney Bus Tours

A modern, responsive travel agency website built with Flask and Bootstrap 5. This application provides user registration and travel inquiry functionality with a sleek dark theme design.

## Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **User Registration**: Secure user account creation with password hashing
- **Travel Inquiries**: Booking form for bus travel reservations
- **Modern UI**: Dark theme with Font Awesome icons
- **Database Integration**: PostgreSQL/SQLite support with SQLAlchemy
- **Form Validation**: Client-side and server-side validation
- **Toast Notifications**: User-friendly feedback messages

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/safejourney-bus-tours.git
cd safejourney-bus-tours
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
export DATABASE_URL="your_postgresql_connection_string"
export SESSION_SECRET="your_secret_key_here"
```

4. Run the application:
```bash
python main.py
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (optional, defaults to SQLite)
- `SESSION_SECRET`: Secret key for session management (required)

## Project Structure

```
safejourney-bus-tours/
├── main.py              # Application entry point
├── app.py               # Flask app configuration
├── models.py            # Database models
├── routes.py            # Web routes
├── templates/
│   └── index.html       # Main webpage template
├── static/
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── main.js      # JavaScript functionality
└── replit.md            # Project documentation
```

## Database Models

### User Model
- Full name, email, phone number
- Secure password hashing
- Registration timestamp

### Inquiry Model
- Contact information
- Travel details (pickup, destination, date)
- Number of seats and special notes
- Inquiry timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue on GitHub.
