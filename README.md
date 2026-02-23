# Projecte Montsià30: Desenvolupament Web i Integració a WordPress

En el que consistia este treball era posar-mos a prova amb tot el que he practicat durant este trimestre: fitxers .html, fitxers .css, fitxers .script, fetch, get, post...
Teniem que pasar la nostra web del sprint 1 al wordpress usant Fetch i JavaScript, no fent-ho manual.
Jo he usat visualstudio code ja que estic familiaritzat i el sprint 1 el vaig usar molt.

## 1. Desenvolupament (HTML, CSS, JS)

En la primera fase del projecte, vam utilitzar una estructura de html+css+Javascript.

### 1.1 Fetch API
Jo el primer que he fet es utilitzar la funció fetch de JavaScript, per a poder fer la web mes dinàmica:
Gracies a aixo hem podia conectar a dades locals o els arxius senser tindre que recargar la pagina cada vegada i poder conectar la web a l'API del Worpress.
<img width="759" height="598" alt="image" src="https://github.com/user-attachments/assets/3372a53b-782a-4c29-9522-75eac3c63156" />


Tambe he utilitzat .then, async i await per a obtenir les respostes correctes i rapides. I ficar-les al DOM

I tambe gracies a aixo he pogut fer que els botons dls menus donin una resposta rapida en base del contingut que tenien carregat.

### 1.2. Visual Studio Code

Tot el desenvolupament ha estat al Visual Studio Code, l'he utilitzat com a centre d'operacions per a poder editar la interficie i adaptar-la al wordpress:

L'he utilitzat per a organitzar-me millor amb els fitxers (.html, .css i .js)per a que quan despres ho pase al wordpress.

Tambe l'he utilitzat per anar mirant com quedava la web. Encara que despres al pasar-ho al worpress s'ha modificat i l'he tingut que tornar a arrglar.
<img width="571" height="116" alt="image" src="https://github.com/user-attachments/assets/479e8124-8640-490e-8ca7-169031eec080" />

He netajat el codi abans de importar-lo al worpress(eliminant selectors) i tambe per a preparar el plugin amb WPCode.

Li he afegit la configuracio de l'API
<img width="393" height="90" alt="image" src="https://github.com/user-attachments/assets/8a55373c-ed90-4c76-b27d-206ee05d3092" />

Despres la estructura de fitxers
<img width="768" height="148" alt="image" src="https://github.com/user-attachments/assets/bf7475ec-2bb4-4e15-8bba-d9c80933f03c" />

El bucle per a pujar cada pagina una per una
<img width="900" height="870" alt="image" src="https://github.com/user-attachments/assets/f871018f-2ecf-4b64-a0d3-719d33d836b0" />


## Integració Dins de WordPress (Pas a Pas)

Una vegada tenia tot aixo fet, el que he fet es descargarme la carpeta del visual studio code pasara a .zip.

<img width="284" height="33" alt="image" src="https://github.com/user-attachments/assets/6e4ee1ed-b456-4b5b-a425-e3a5f067f3eb" />

I pasarme-la al drive, per a quan inicie sesio dins de virtualio.io tingue la carpeta al drive i poder exportar-la.
<img width="902" height="470" alt="image" src="https://github.com/user-attachments/assets/2d1acafa-152b-495a-aa25-3e045958687c" />

Una vegada la tenia al drive la baix descarregar i exportar todo.
<img width="509" height="567" alt="image" src="https://github.com/user-attachments/assets/db79bfca-a633-4e12-832a-655fbd254e34" />

I ja la tenia fora.
<img width="107" height="137" alt="image" src="https://github.com/user-attachments/assets/45927fee-72fd-4b58-bddf-ac9e0dcd0197" />


Despres el que vaig fer va ser a la terminal entra al escritori a on tenia la carpeta
<img width="765" height="30" alt="image" src="https://github.com/user-attachments/assets/16585d98-f8a1-4d70-a669-168db3ba2352" />

I vaig executar la comanda node importador.js(perque la carpeta s'anomenava importador.js)

<img width="986" height="24" alt="image" src="https://github.com/user-attachments/assets/c70d590b-24ac-4afe-aac7-e8a37764925a" />
Gracies a esta comanda el que faig es executa el codi Javascript directament.

Despres dins de WordPress, s'han creat les pàgines .html (Inici, Digitalització, etc.).
<img width="688" height="371" alt="image" src="https://github.com/user-attachments/assets/8b0cfaca-0a71-4308-bb7b-fda87c0e9cd8" />

I al fer visualitzacio de les pagines, he vist que faltaven les fotos i he editat el codi html per a ficar be les URL de les fotos.
<img width="194" height="139" alt="image" src="https://github.com/user-attachments/assets/5375ac79-3c5e-4650-8523-23a2f7c58244" />


##  Code Snippets
Per a que no es canvie el disseny de la pagina he estat utilitzant WPCode, per a poder crear un sipset CSS i ficar el codi CSS.
<img width="1210" height="262" alt="image" src="https://github.com/user-attachments/assets/d6aa5341-04ed-4e89-9661-560c97df6e19" />
<img width="1496" height="673" alt="image" src="https://github.com/user-attachments/assets/a111f910-eb18-408d-a738-7b009c661298" />




## 4. Resultat i Conclusions

Estava avançant molt hasta que m'he quedat bloquejat al .css arreglant-lo tantes vegades miha fet liarme i no he pogut acabar de ficar el javascript.
Tambe volia implementar el Carrusel amb javascript per a que funcionen les fletxes laterals i ficar un desplaçament automatic a x segons.
Tambe tinc que afegir que no he enseñat la cara dolenta del treball: he tingut errors, bloquiejs, no s'han aguardat els canvis, he eliminat coses sense voler, poc espai...
Pero lo bo es que m'he n'he surtit de tots, gracies a la constancia.

## 5. Take a way

Jo de esta practica he apres molt: he apres a com utilitzar fetch i com conectar a API de Wordpress, pero sobretot he entes com funciona Wordpress i la divercitat de coses que te en ell(.
He apres a pasar codigs(web), al wordpress via terminal i utilitzant configuracio de API per a que nomes ficant 1 comanda me entre tota la web(per pagines) al worpress(code snipset, pagines, aparençes...). 
Tambe he apres a editar la pagina .html per a que el codi es veigue mes net al pasar-ho al wordpress. Despres he apres a anar editant el codi i mirant-ho a la vegada amb el (Live).

I teu puc comprovar amb les captures que he ficat fent-ho jo amb visual studio code i despres ficant-ho via terminal al wordpress. 
Tambe pots mirar-ho amb la meva IP entrant al wordpress i mirant que ho tinc fet be.









[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9mNzgUbu)

