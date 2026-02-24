const fs = require('fs');
const path = require('path');

// --- 1. CONFIGURACIÓ DE L'API ---
const WP_URL = "http://10.0.63.30:8080"; 
const USER = "Abdu";
const PASS = "1234";

// --- 2. LA VOSTRA ESTRUCTURA DE FITXERS ---
// Aquí definim quins fitxers llegirà i quin títol tindrà la pàgina al WordPress
const paginesAImportar = [
    { titol: "Inici", ruta: "./index.html" },
    { titol: "Digitalització", ruta: "./Digitalització/digitalitzacio.html" },
    { titol: "Intranet", ruta: "./Intranet/intranet.html" },
    { titol: "Detalls de l'Empresa", ruta: "./Intranet/detall-empresa.html" }
];

async function executarImportacio() {
    console.log("🚀 Iniciant l'automatització...");

    /
    console.log("🔑 Connectant al WordPress per obtenir permisos...");
    let token = "";
    try {
        const loginRes = await fetch(WP_URL + "/wp-json/jwt-auth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: USER, password: PASS })
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
            token = loginData.token;
            console.log("✅ Login correcte! Token obtingut.\n");
        } else {
            console.error("❌ Error de Login:", loginData);
            return; 
        }
    } catch (error) {
        console.error("❌ Error de xarxa al fer login:", error.message);
        return;
    }

    // --- 4. BUCLE: PUJAR CADA PÀGINA UNA PER UNA ---
    for (const pagina of paginesAImportar) {
        console.log(`📄 Processant: ${pagina.titol} (${pagina.ruta})`);

        try {
            
            const rutaCompleta = path.resolve(__dirname, pagina.ruta);
            const contingutHTML = fs.readFileSync(rutaCompleta, 'utf8');

           
            const postRes = await fetch(WP_URL + "/wp-json/wp/v2/pages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title: pagina.titol,
                    content: contingutHTML,
                    status: "publish" 
                })
            });

            const postData = await postRes.json();

            if (postData.id) {
                console.log(`   ✅ ÈXIT! Pàgina creada: ${postData.link}\n`);
            } else {
                console.error(`   ❌ Error al WP:`, postData);
            }

        } catch (err) {
            console.error(`   ❌ Error llegint o pujant l'arxiu ${pagina.ruta}:`, err.message);
        }
    }
    
    console.log("🎉 Procés acabat!");
}

// Executem l'script
executarImportacio();