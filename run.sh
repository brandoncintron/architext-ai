# Start the FastAPI server in the background
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000 api.index:app &

# Start the Next.js server
npm start