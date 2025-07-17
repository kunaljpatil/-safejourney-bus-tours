from flask import render_template, request, jsonify, current_app
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def register_routes(app, db):
    """Register all routes with the Flask app"""
    
    from models import User, Inquiry
    
    @app.route('/')
    def index():
        """Main page route"""
        return render_template('index.html')

    @app.route('/register', methods=['POST'])
    def register():
        """Handle user registration"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['full_name', 'email', 'password', 'phone_number']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'success': False, 'message': f'{field.replace("_", " ").title()} is required'}), 400
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({'success': False, 'message': 'Email already registered'}), 400
            
            # Create new user
            user = User(
                full_name=data['full_name'],
                email=data['email'],
                phone_number=data['phone_number']
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            logger.info(f'New user registered: {user.email}')
            return jsonify({'success': True, 'message': 'Registration successful!'})
            
        except Exception as e:
            logger.error(f'Registration error: {str(e)}')
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Registration failed. Please try again.'}), 500

    @app.route('/inquiry', methods=['POST'])
    def submit_inquiry():
        """Handle travel inquiry submission"""
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'email', 'phone_number', 'pickup_location', 'drop_location', 'travel_date', 'number_of_seats']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'success': False, 'message': f'{field.replace("_", " ").title()} is required'}), 400
            
            # Parse travel date
            try:
                travel_date = datetime.strptime(data['travel_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'success': False, 'message': 'Invalid travel date format'}), 400
            
            # Validate number of seats
            try:
                seats = int(data['number_of_seats'])
                if seats <= 0:
                    return jsonify({'success': False, 'message': 'Number of seats must be greater than 0'}), 400
            except ValueError:
                return jsonify({'success': False, 'message': 'Invalid number of seats'}), 400
            
            # Create new inquiry
            inquiry = Inquiry(
                name=data['name'],
                email=data['email'],
                phone_number=data['phone_number'],
                pickup_location=data['pickup_location'],
                drop_location=data['drop_location'],
                travel_date=travel_date,
                number_of_seats=seats,
                notes=data.get('notes', '')
            )
            
            db.session.add(inquiry)
            db.session.commit()
            
            logger.info(f'New inquiry submitted: {inquiry.name} - {inquiry.travel_date}')
            return jsonify({'success': True, 'message': 'Thank you for your inquiry! We will contact you soon.'})
            
        except Exception as e:
            logger.error(f'Inquiry submission error: {str(e)}')
            db.session.rollback()
            return jsonify({'success': False, 'message': 'Inquiry submission failed. Please try again.'}), 500

    @app.errorhandler(404)
    def not_found(error):
        return render_template('index.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
