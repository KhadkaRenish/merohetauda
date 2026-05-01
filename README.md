# Mero Hetauda

Mero Hetauda is a civic mobile/web app built with **React Native Expo** and **Django REST Framework**.  
The goal of this app is to help people view local Hetauda/Makwanpur news and later report local community issues such as road damage, waste problems, water supply issues, electricity problems, and other public concerns.

---

## Tech Stack

### Frontend
- React Native
- Expo
- Expo Router
- TypeScript

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- django-cors-headers

---

## Project Structure

```txt
merohetauda/
│
├── app/                    # Expo Router screens
│   └── (tabs)/
│       ├── index.tsx       # Home screen
│       ├── news.tsx        # News screen
│       ├── reports.tsx     # Reports screen
│       ├── create-report.tsx
│       └── profile.tsx
│
├── constants/
│   └── api.ts              # API base URL config
│
├── backend/                # Django backend
│   ├── config/             # Django project settings
│   ├── news/               # News app
│   ├── manage.py
│   └── venv/
│
├── package.json
└── README.md
````

---

# How to Run This Project

This project has two parts:

```txt
1. Django backend
2. Expo frontend
```

You need to run both.

---

# Backend Setup

## 1. Go to backend folder

```bash
cd backend
```

## 2. Activate virtual environment

On Mac:

```bash
source venv/bin/activate
```

After activation, terminal should show something like:

```bash
(venv) yourname@MacBook backend %
```

## 3. Install backend dependencies

```bash
python3 -m pip install -r requirements.txt
```

If `requirements.txt` is not available yet, install manually:

```bash
python3 -m pip install django djangorestframework django-cors-headers psycopg2-binary requests beautifulsoup4 lxml pillow
```

Then create/update requirements file:

```bash
python3 -m pip freeze > requirements.txt
```

---

# PostgreSQL Setup

This project uses PostgreSQL.

Create a PostgreSQL database using pgAdmin or terminal.

Recommended local database values:

```txt
Database name: merohetauda_db
Username: merohetauda_user
Password: merohetauda_password
Host: localhost
Port: 5432
```

In Django `backend/config/settings.py`, database should look like this:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "merohetauda_db",
        "USER": "merohetauda_user",
        "PASSWORD": "merohetauda_password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

---

# Run Backend Migrations

Inside the `backend` folder:

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

---

# Create Django Admin User

```bash
python3 manage.py createsuperuser
```

Follow the terminal instructions and create your admin username/password.

---

# Start Django Backend Server

For web testing on the same laptop:

```bash
python3 manage.py runserver
```

Backend will run at:

```txt
http://127.0.0.1:8000/
```

News API:

```txt
http://127.0.0.1:8000/api/news/
```

Django Admin:

```txt
http://127.0.0.1:8000/admin/
```

---

# Running Backend for Phone Testing

If testing the Expo app on a real iPhone or Android phone, run Django like this:

```bash
python3 manage.py runserver 0.0.0.0:8000
```

Then find your Mac IP:

```bash
ipconfig getifaddr en0
```

Example result:

```txt
192.168.1.12
```

Then the backend API for phone will be:

```txt
http://192.168.1.12:8000/api
```

Also add your Mac IP in `backend/config/settings.py`:

```python
ALLOWED_HOSTS = ["127.0.0.1", "localhost", "192.168.1.12"]
```

For local development, CORS should be enabled:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

---

# Frontend Setup

## 1. Go to project root

From backend folder:

```bash
cd ..
```

You should be inside:

```txt
merohetauda/
```

## 2. Install frontend dependencies

```bash
npm install
```

## 3. Configure API URL

Open:

```txt
constants/api.ts
```

For web testing, use:

```ts
export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/api",
};
```

For phone testing, use your Mac IP:

```ts
export const API_CONFIG = {
  BASE_URL: "http://192.168.1.12:8000/api",
};
```

Replace `192.168.1.12` with your real Mac IP.

---

# Start Expo Frontend

```bash
npx expo start
```

This will show a QR code.

---

# Open App on Web

After running Expo:

```bash
npx expo start
```

Press:

```txt
w
```

This opens the app in browser.

Usually frontend runs on:

```txt
http://localhost:8081
```

---

# Open App on iPhone

## 1. Install Expo Go

Install **Expo Go** from the App Store.

## 2. Start Expo

```bash
npx expo start
```

If QR does not work, use tunnel mode:

```bash
npx expo start --tunnel
```

## 3. Scan QR Code

Use iPhone Camera or Expo Go to open the app.

If the API does not load on iPhone, make sure:

```txt
- Django server is running with 0.0.0.0:8000
- constants/api.ts uses Mac IP, not 127.0.0.1
- MacBook and iPhone are on same Wi-Fi
- ALLOWED_HOSTS includes Mac IP
```

---

# Open App on Android

## 1. Install Expo Go

Install **Expo Go** from Google Play Store.

## 2. Start Expo

```bash
npx expo start
```

Or:

```bash
npx expo start --tunnel
```

## 3. Open Expo Go

Open Expo Go and scan the QR code.

---

# News Feature

The News feature currently works like this:

```txt
Django NewsArticle model
        ↓
Django REST API
        ↓
Expo News screen
```

API endpoint:

```txt
GET /api/news/
```

Example full URL:

```txt
http://127.0.0.1:8000/api/news/
```

The Expo app fetches news from:

```ts
`${API_CONFIG.BASE_URL}/news/`
```

---

# Add News Manually from Django Admin

Open:

```txt
http://127.0.0.1:8000/admin/
```

Go to:

```txt
News Articles
```

Add:

```txt
Title
Summary
Source name
Original URL
Image URL
Category
Published date
Is active
```

Only active news will show in the mobile app.

---

# Fetch News Automatically

A Django management command can be used to fetch news metadata from online sources.

Run:

```bash
python3 manage.py fetch_news
```

This saves:

```txt
Title
Summary
Source name
Original URL
Image URL
Category
```

The app does not copy full news articles. It only shows news cards and links users to the original source.

---

# Common Issues

## 1. CORS Error

Error:

```txt
No 'Access-Control-Allow-Origin' header is present
```

Fix in `backend/config/settings.py`:

```python
INSTALLED_APPS = [
    ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True
```

Restart Django:

```bash
python3 manage.py runserver
```

---

## 2. API Works in Browser But Not on Phone

Problem:

```txt
127.0.0.1 works on laptop but not phone
```

Reason:

```txt
127.0.0.1 on phone means the phone itself, not your MacBook.
```

Fix:

Use Mac IP in `constants/api.ts`:

```ts
export const API_CONFIG = {
  BASE_URL: "http://YOUR_MAC_IP:8000/api",
};
```

Run backend:

```bash
python3 manage.py runserver 0.0.0.0:8000
```

---

## 3. Expo QR Shows Unusable Data on iPhone

Try:

```bash
npx expo start --tunnel
```

Then scan again using Expo Go or iPhone Camera.

---

## 4. Django Package Missing

If you see:

```txt
ModuleNotFoundError: No module named 'django'
```

Activate venv:

```bash
cd backend
source venv/bin/activate
```

Install dependencies:

```bash
python3 -m pip install -r requirements.txt
```

---





