FROM nginx:alpine

COPY . /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh","-c","uvicorn app:app --host 0.0.0.0 --port ${PORT:-7860}"]