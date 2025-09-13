ElevenLabs Text-to-Speech Application
This project is a full-stack web application that is text-to-speech platform. It features a Next.js frontend for a modern, reactive user experience and a Django backend to serve audio file data from a MongoDB database.

The application is designed for production deployment, with the frontend hosted on Vercel, the backend on Render, and the database on MongoDB Atlas.

Tech Stack
Frontend:

Next.js (React Framework)

TypeScript

Tailwind CSS for styling

Lucide React for icons

Backend:

Django

Django REST Framework

Gunicorn (Production WSGI Server)

Database:

MongoDB (with Djongo connector)

Deployment:

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

Getting Started: Local Development
Follow these steps to set up and run the application on your local machine.

Python and pip

A local MongoDB instance running

1. Backend Setup
First, set up and run the Django server.

# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# 3. Install the required Python packages
pip install -r requirements.txt

# 4. Create an environment file
# Create a file named .env in the /backend directory and add the following:
# SECRET_KEY='your-local-secret-key'
# DEBUG=True
# ALLOWED_HOST=127.0.0.1,localhost
# DATABASE_URL=mongodb://localhost:27017/
# DB_NAME=elevenlabs_db
# CORS_ORIGIN=http://localhost:3000

# 5. Populate your local database with initial data
# (Ensure your local MongoDB is running)
python populate_db.py

# 6. Run the Django development server
python manage.py runserver

Your backend API should now be running at http://127.0.0.1:8000.

2. Frontend Setup
In a new terminal, set up and run the Next.js frontend.

# 1. Navigate to the frontend directory
cd frontend

# 2. Install the required npm packages
npm install

# 3. Create a local environment file
# Create a file named .env.local in the /frontend directory and add the following:
# NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

# 4. Run the Next.js development server
npm run dev

Your frontend should now be running at http://localhost:3000.

https://elevenlabs-project.onrender.com
