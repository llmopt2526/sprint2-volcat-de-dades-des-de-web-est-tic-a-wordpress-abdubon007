const fs   = require('fs');
const path = require('path');

// Configuració
const WP_URL = "http://10.0.63.30:8080";
const USER   = "admin";
const PASS   = "1234";
const BASE   = __dirname;

// URLs de WordPress per a cada pagina
const WP = {
  inici:        WP_URL + "/inici-montsia30/",
  digital:      WP_URL + "/digitalitzacio/",
  intranet:     WP_URL + "/intranet/",
  detall:       WP_URL + "/detall-empresa/"
};

// ── Convertir imatge a base64 ──────────────────────────
function imatgeABase64(rutaImatge) {
  if (!fs.existsSync(rutaImatge)) return null;
  const ext = path.extname(rutaImatge).toLowerCase().replace('.', '');
  const mime = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', gif: 'gif', svg: 'svg+xml' };
  const tipus = mime[ext] || ext;
  const dades = fs.readFileSync(rutaImatge);
  return "data:image/" + tipus + ";base64," + dades.toString('base64');
}

// ── Inlinear imatges (convertir src a base64) ──────────
function inlinearImatges(html, dirBase) {
  return html.replace(/src=["']([^"']+)["']/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) {
      return match;
    }
    const rutaCompleta = path.resolve(dirBase, src);
    const base64 = imatgeABase64(rutaCompleta);
    if (base64) {
      return 'src="' + base64 + '"';
    }
    console.log("   Imatge no trobada: " + rutaCompleta);
    return match;
  });
}

// ── Inlinear CSS ───────────────────────────────────────
function inlinearCSS(html, fitxersCSS) {
  let css = '';
  for (const fitxer of fitxersCSS) {
    const ruta = path.resolve(BASE, fitxer);
    if (fs.existsSync(ruta)) {
      css += fs.readFileSync(ruta, 'utf8') + '\n';
    }
  }
  html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, '');
  return html.replace('</head>', '<style>\n' + css + '\n</style>\n</head>');
}

// ── Inlinear JS (amb reemplaçament de rutes) ───────────
function inlinearJS(html, fitxersJS, reemplaces) {
  let js = '';
  for (const fitxer of fitxersJS) {
    const ruta = path.resolve(BASE, fitxer);
    if (fs.existsSync(ruta)) {
      let contingut = fs.readFileSync(ruta, 'utf8');
      for (const [de, a] of Object.entries(reemplaces)) {
        contingut = contingut.split(de).join(a);
      }
      js += contingut + '\n';
    }
  }
  // Eliminar les etiquetes <script src="...">
  html = html.replace(/<script[^>]+src=["'][^"']+["'][^>]*><\/script>/gi, '');
  // Afegir el JS inline abans de </body>
  return html.replace('</body>', '<script>\n' + js + '\n</script>\n</body>');
}

// ── Arreglar links href en HTML ────────────────────────
function arreglarLinks(html, reemplaces) {
  let resultat = html;
  for (const [de, a] of Object.entries(reemplaces)) {
    resultat = resultat.split('href="' + de + '"').join('href="' + a + '"');
    resultat = resultat.split("href='" + de + "'").join("href='" + a + "'");
  }
  return resultat;
}

// ── Processament per pagina ────────────────────────────
function processarInici() {
  let html = fs.readFileSync(path.resolve(BASE, 'index.html'), 'utf8');
  const dir = BASE;

  // 1. CSS inline
  html = inlinearCSS(html, [
    './components/common-styles.css',
    './pagina_inici/CSS_OPT.css'
  ]);

  // 2. Arreglar links HTML
  html = arreglarLinks(html, {
    'index.html':                             WP.inici,
    'Digitalització/digitalitzacio.html':     WP.digital,
    'Digitalització/digitalitzacio.html#slide-0': WP.digital + '#slide-0',
    'Digitalització/digitalitzacio.html#slide-1': WP.digital + '#slide-1',
    'Digitalització/digitalitzacio.html#slide-2': WP.digital + '#slide-2',
    'Digitalització/digitalitzacio.html#slide-3': WP.digital + '#slide-3',
    'Intranet/intranet.html':                 WP.intranet
  });

  // 3. JS inline amb links corregits
  html = inlinearJS(html, ['./pagina_inici/pagina-inici.js'], {
    "'Digitalització/digitalitzacio.html'":  "'" + WP.digital + "'",
    "'Intranet/intranet.html'":              "'" + WP.intranet + "'",
    "'index.html'":                          "'" + WP.inici + "'"
  });

  // 4. Imatges inline
  html = inlinearImatges(html, dir);

  return html;
}

function processarDigitalitzacio() {
  const dirPagina = path.resolve(BASE, 'Digitalització');
  let html = fs.readFileSync(path.resolve(dirPagina, 'digitalitzacio.html'), 'utf8');

  // 1. CSS inline
  html = inlinearCSS(html, [
    './components/common-styles.css',
    './Digitalització/digitalitzacio.css'
  ]);

  // 2. Arreglar links HTML
  html = arreglarLinks(html, {
    '../index.html':                              WP.inici,
    'digitalitzacio.html#slide-0':               WP.digital + '#slide-0',
    'digitalitzacio.html#slide-1':               WP.digital + '#slide-1',
    'digitalitzacio.html#slide-2':               WP.digital + '#slide-2',
    'digitalitzacio.html#slide-3':               WP.digital + '#slide-3',
    '../Intranet/intranet.html':                  WP.intranet
  });

  // 3. JS inline amb links corregits
  html = inlinearJS(html, ['./Digitalització/digitalitzacio.js'], {
    "'../index.html'":  "'" + WP.inici + "'"
  });

  // 4. Imatges inline (les imatges son relatives a la carpeta Digitalitzacio)
  html = inlinearImatges(html, dirPagina);

  return html;
}

function processarIntranet() {
  const dirPagina = path.resolve(BASE, 'Intranet');
  let html = fs.readFileSync(path.resolve(dirPagina, 'intranet.html'), 'utf8');

  // 1. CSS inline
  html = inlinearCSS(html, [
    './components/common-styles.css',
    './Intranet/intranet.css'
  ]);

  // 2. Arreglar links HTML
  html = arreglarLinks(html, {
    '../index.html':                                  WP.inici,
    '../Digitalització/digitalitzacio.html#slide-0': WP.digital + '#slide-0',
    '../Digitalització/digitalitzacio.html#slide-1': WP.digital + '#slide-1',
    '../Digitalització/digitalitzacio.html#slide-2': WP.digital + '#slide-2',
    '../Digitalització/digitalitzacio.html#slide-3': WP.digital + '#slide-3',
    'intranet.html':                                  WP.intranet
  });

  // 3. JS inline amb links corregits
  html = inlinearJS(html, [
    './Intranet/js/dades-empreses.js',
    './Intranet/js/intranet.js'
  ], {
    "'../index.html'":         "'" + WP.inici + "'",
    'intranetSessio':          'intranetSessio',
    '`detall-empresa.html?id=${empresa.id}`': '`' + WP.detall + '?id=${empresa.id}`'
  });

  // 4. Imatges inline
  html = inlinearImatges(html, dirPagina);

  return html;
}

function processarDetallEmpresa() {
  const dirPagina = path.resolve(BASE, 'Intranet');
  let html = fs.readFileSync(path.resolve(dirPagina, 'detall-empresa.html'), 'utf8');

  // 1. CSS inline
  html = inlinearCSS(html, [
    './components/common-styles.css',
    './Intranet/intranet.css'
  ]);

  // 2. Arreglar links HTML
  html = arreglarLinks(html, {
    '../index.html':                                  WP.inici,
    '../Digitalització/digitalitzacio.html#slide-0': WP.digital + '#slide-0',
    '../Digitalització/digitalitzacio.html#slide-1': WP.digital + '#slide-1',
    '../Digitalització/digitalitzacio.html#slide-2': WP.digital + '#slide-2',
    '../Digitalització/digitalitzacio.html#slide-3': WP.digital + '#slide-3',
    'intranet.html':                                  WP.intranet
  });

  // 3. JS inline amb links corregits
  html = inlinearJS(html, [
    './Intranet/js/dades-empreses.js',
    './Intranet/js/detall-empresa.js'
  ], {
    "'intranet.html'":  "'" + WP.intranet + "'"
  });

  // 4. Imatges inline
  html = inlinearImatges(html, dirPagina);

  return html;
}

// ── Funció principal ───────────────────────────────────
async function executarImportacio() {
  console.log("Iniciant importacio...");

  // Login JWT
  let token = "";
  try {
    const res = await fetch(WP_URL + "/wp-json/jwt-auth/v1/token", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username: USER, password: PASS })
    });
    const dades = await res.json();
    if (dades.token) {
      token = dades.token;
      console.log("Login correcte");
    } else {
      console.log("Error de login:", dades);
      return;
    }
  } catch (err) {
    console.log("Error de connexio:", err.message);
    return;
  }

  // Pagines a pujar
  const pagines = [
    { titol: "Inici - Montsia30",  html: processarInici() },
    { titol: "Digitalitzacio",     html: processarDigitalitzacio() },
    { titol: "Intranet",           html: processarIntranet() },
    { titol: "Detall Empresa",     html: processarDetallEmpresa() }
  ];

  for (const pagina of pagines) {
    console.log("Pujant: " + pagina.titol + " (" + Math.round(pagina.html.length / 1024) + " KB)");
    try {
      const res = await fetch(WP_URL + "/wp-json/wp/v2/pages", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          title:   pagina.titol,
          content: { raw: pagina.html },
          status:  "publish"
        })
      });
      const dades = await res.json();
      if (dades.id) {
        console.log("Pagina creada: " + dades.link);
      } else {
        console.log("Error:", JSON.stringify(dades).substring(0, 200));
      }
    } catch (err) {
      console.log("Error pujant " + pagina.titol + ":", err.message);
    }
  }

  console.log("Importacio acabada.");
}

executarImportacio();
