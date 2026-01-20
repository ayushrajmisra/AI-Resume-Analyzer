from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS # Import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- Simulated Database ---
# In a real application, you would use a proper database (e.g., SQLAlchemy with SQLite/PostgreSQL)
users_db = {} # Stores {email: hashed_password}
contact_messages_db = [] # Stores list of contact messages

# --- Helper Functions ---
def is_valid_email(email):
    """Basic email validation."""
    import re
    return re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email)

def is_valid_password(password):
    """
    Password validation matching frontend rules:
    - At least 8 characters long.
    - Contains at least one uppercase letter.
    - Contains at least one lowercase letter.
    - Contains at least one number.
    - Contains at least one special character.
    """
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not any(char.isupper() for char in password):
        return "Password must contain at least one uppercase letter."
    if not any(char.islower() for char in password):
        return "Password must contain at least one lowercase letter."
    if not any(char.isdigit() for char in password):
        return "Password must contain at least one number."
    if not any(char in "!@#$%^&*(),.?\":{}|<> " for char in password):
        return "Password must contain at least one special character."
    return True # Password is valid

# --- Routes ---

@app.route('/')
def home():
    return "CareerCraft Backend is running!"

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    password_validation_result = is_valid_password(password)
    if password_validation_result is not True:
        return jsonify({"error": password_validation_result}), 400

    if email in users_db:
        return jsonify({"error": "Email already registered."}), 409

    hashed_password = generate_password_hash(password)
    users_db[email] = hashed_password
    print(f"User registered: {email}") # For debugging
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    hashed_password = users_db.get(email)

    if not hashed_password or not check_password_hash(hashed_password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    # In a real app, you'd generate a JWT token here and return it
    print(f"User logged in: {email}") # For debugging
    return jsonify({"message": "Login successful!", "user": {"email": email}}), 200

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"error": "All fields are required."}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    # In a real application, you would:
    # 1. Store this message in a database.
    # 2. Send an email to an admin.
    contact_messages_db.append({"name": name, "email": email, "message": message})
    print(f"Contact message received from {name} ({email}): {message}") # For debugging
    return jsonify({"message": "Your message has been sent successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Run on port 5000, debug=True for development
