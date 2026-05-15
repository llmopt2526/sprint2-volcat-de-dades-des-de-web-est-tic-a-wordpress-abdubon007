# Sprint 2 — Bolcat de dades a WordPress · Montsià30

## Què és aquest projecte?

En aquest sprint hem agafat les pàgines HTML que vam fer al Sprint 1 (el projecte Montsià30) i les hem pujat automàticament a WordPress utilitzant la seva REST API amb autenticació JWT.

En lloc de crear les pàgines a mà des del panell d'administració, hem creat un script en Node.js (`importador.js`) que ho fa tot sol.

---

## Vídeo de demostració

https://youtu.be/S5vetVGwDZE

---

## Pàgines transferides del Sprint 1

Hem triat aquestes 4 pàgines perquè són les principals del projecte:

| Fitxer original | Pàgina a WordPress |
|----------------|-------------------|
| `index.html` | Inici - Montsia30 |
| `Digitalització/digitalitzacio.html` | Digitalitzacio |
| `Intranet/intranet.html` | Intranet |
| `Intranet/detall-empresa.html` | Detall Empresa |

---

## Requisits

- Ubuntu Server 24.04 amb Docker
- Ubuntu Desktop 24.04 amb Node.js v18 o superior
- Les dues màquines han d'estar a la mateixa xarxa

---

## Passos per reproduir el projecte

### 1. Instal·lar Docker al Server

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Crear i arrencar WordPress amb Docker

```bash
mkdir ~/wordpress && cd ~/wordpress
nano docker-compose.yml
```

Contingut del fitxer:

```yaml
services:
  db:
    image: mariadb:11
    container_name: wp_db
    restart: unless-stopped
    environment:
      MARIADB_DATABASE: wordpress
      MARIADB_USER: wpuser
      MARIADB_PASSWORD: wp_pass_123
      MARIADB_ROOT_PASSWORD: root_pass_123
    volumes:
      - db_data:/var/lib/mysql

  wordpress:
    image: wordpress:latest
    container_name: wp_app
    restart: unless-stopped
    depends_on:
      - db
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wp_pass_123
    volumes:
      - wp_data:/var/www/html

volumes:
  db_data:
  wp_data:
```

```bash
docker compose up -d
docker ps
```

![docker ps mostrant els dos contenidors actius](img/01_docker_ps.png)

### 3. Instal·lar i configurar JWT

**Instal·lar el plugin:**
wp-admin → Extensions → Afegeix → cerca **JWT Authentication for WP-API** → Instal·la → Activa

![Plugin JWT actiu](img/04_plugin_jwt.png)

**Modificar .htaccess** (dins del contenidor):

```bash
docker exec -it wp_app bash
apt update && apt install -y nano
nano /var/www/html/.htaccess
```

Afegir abans de `# BEGIN WordPress`:

```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
</IfModule>
```

![.htaccess modificat](img/03_htaccess.png)

**Modificar wp-config.php:**

```bash
nano /var/www/html/wp-config.php
```

Afegir abans de `/* That's all, stop editing! */`:

```php
define('JWT_AUTH_SECRET_KEY', 'clau_super_secreta_sprint2_2026');
define('JWT_AUTH_CORS_ENABLE', true);
```

![wp-config.php modificat](img/02_wp_config.png)

```bash
exit
```

**Configurar Permalinks:**
wp-admin → Opcions → Enllaços permanents → Nom de l'entrada → Desa

![Configuració permalinks](img/05_permalinks.png)

### 4. Executar l'script

```bash
sudo apt install -y nodejs npm
cd ~/GS1_OPT_LLM_SRINT1_EQUI4-main
node importador.js
```

![Execució de node importador.js](img/07_node_importador.png)

### 5. Resultat a WordPress

![Pàgines creades a wp-admin](img/06_pagines_admin.png)

![Pàgina Inici al frontend](img/08_frontend.png)

---

## Explicació de l'script importador.js

### Objectiu de la funció global

L'script `importador.js` té una única funció principal (`executarImportacio`) que s'encarrega de tot el procés de transferència. Quan l'executes, fa dues coses en ordre: primer s'autentica a WordPress per obtenir un token, i després utilitza aquest token per crear les pàgines una per una.

```javascript
async function executarImportacio() {
    // 1. Primer fa login i obte el token
    // 2. Despres puja cada pagina amb el token
}

executarImportacio();
```

---

### Autenticació amb JWT (tokens)

**Què és fetch?**
`fetch` és una funció de JavaScript que permet fer peticions HTTP a un servidor. En el nostre cas l'usem per comunicar-nos amb la REST API de WordPress. Retorna una promesa, per això usem `await` per esperar la resposta.

Per accedir a la REST API de WordPress cal autenticar-se primer. Ho fem enviant l'usuari i la contrasenya a l'endpoint de JWT, que ens retorna un **token** (una clau temporal):

```javascript
const loginRes = await fetch(WP_URL + "/wp-json/jwt-auth/v1/token", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username: USER, password: PASS })
});

const loginData = await loginRes.json();

if (loginData.token) {
    token = loginData.token;
    console.log("Login correcte");
}
```

El token és una cadena de text llarga (format JWT) que identifica que som administradors. L'afegim a totes les peticions següents a la capçalera `Authorization: Bearer TOKEN`.

---

### Endpoints utilitzats (pàgines)

Un **endpoint** és una URL de l'API que accepta peticions. Hem usat dos endpoints:

| Endpoint | Mètode | Per a què serveix |
|----------|--------|------------------|
| `/wp-json/jwt-auth/v1/token` | POST | Obtenir el token JWT fent login |
| `/wp-json/wp/v2/pages` | POST | Crear una nova pàgina a WordPress |

Les 4 pàgines que creem a `/wp-json/wp/v2/pages` corresponen a:
- `Inici - Montsia30` → `http://10.0.63.30:8080/inici-montsia30/`
- `Digitalitzacio` → `http://10.0.63.30:8080/digitalitzacio/`
- `Intranet` → `http://10.0.63.30:8080/intranet/`
- `Detall Empresa` → `http://10.0.63.30:8080/detall-empresa/`

---

### Funcionament de l'algorisme (POST)

Per cada pàgina, l'script segueix sempre el mateix procés:

**Pas 1 — Llegir i preparar el HTML:**
```javascript
// Llegir el fitxer HTML
let html = fs.readFileSync(rutaCompleta, 'utf8');

// Inlinear el CSS (perque WordPress no pot accedir als fitxers CSS locals)
html = inlinearCSS(html, fitxersCSS);

// Convertir les imatges a base64 (perque les rutes relatives no funcionen a WP)
html = inlinearImatges(html, dirBase);

// Arreglar els links de navegació (substituir rutes relatives per URLs de WP)
html = arreglarLinks(html, reemplaces);

// Inlinear el JavaScript amb els links ja corregits
html = inlinearJS(html, fitxersJS, reemplaces);
```

**Pas 2 — Enviar a WordPress via POST:**
```javascript
const postRes = await fetch(WP_URL + "/wp-json/wp/v2/pages", {
    method:  "POST",
    headers: {
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + token   // el token del login
    },
    body: JSON.stringify({
        title:   pagina.titol,               // titol de la pagina
        content: { raw: html },              // contingut HTML complet
        status:  "publish"                   // publicar directament
    })
});

const postData = await postRes.json();

if (postData.id) {
    console.log("Pagina creada: " + postData.link);
}
```

WordPress rep el HTML, el desa a la base de dades i crea la pàgina. Si tot va bé, retorna un JSON amb l'`id` i la `link` de la pàgina creada.

---

## Problemes trobats

| Problema | Solució |
|----------|---------|
| `docker compose up -d` no funcionava | Usar `docker-compose up -d` amb guió |
| JWT retornava 404 | Calia configurar els Permalinks a wp-admin |
| Les pàgines no tenien estil | Vam inlinear el CSS amb la funció `inlinearCSS()` |
| Les imatges no apareixien | Vam convertir-les a base64 amb `inlinearImatges()` |
| Els botons no navegaven bé | Vam substituir les rutes relatives per URLs de WP |

---

*SMX2 - 0228 Aplicacions Web · Institut Montsià · Curs 25-26*
