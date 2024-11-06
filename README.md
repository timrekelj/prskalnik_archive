<p align="center">
  <img src="https://i.ibb.co/W6WykHy/prskalnik.jpg" title="Prskalnik logo">
</p>

> Poišči si prakso, ki ti ustreza in mi ti bomo pomagali stopiti v stik z delodajalcem

## Requirements
 - Node lts/hydrogen (18.14.2)

## Installation and quickstart

Make sure to install the dependencies:

```bash
npm install
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

### Nginx configuration
1. Write this to `/etc/nginx/sites-available/default`

```
server {
    index index.html;
    server_name development.prskalnik.si;

    location / {
        proxy_pass http://localhost:2023;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Restart nginx
```
sudo systemctl restart nginx
```

3. Install certificates with [certbot](https://certbot.eff.org/) 
