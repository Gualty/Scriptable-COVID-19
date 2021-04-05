// VACCINAZIONI ITALIA PER REGIONE v.1.1
// Developer by Gualty@GitHub https://github.com/Gualty
// Questo script estrapola i dati forniti dal Governo e mostra quelli della regione scelta
// Fonte: https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json
// Pagina GitHub ufficiale "Covid-19 Opendata Vaccini": https://github.com/italia/covid19-opendata-vaccini

// From an idea of sebasanblas@Github https://gist.github.com/sebasanblas/d3638867a99c4d84942c159b88bb4096 and
// marco79cgn@Github (https://gist.github.com/marco79cgn/b5f291d6242a2c530e56c748f1ae7f2c)

// SELEZIONA REGIONE
// Puoi scegliere la regione impostando i parametri da passare allo script oppure modificando il valore qui sotto di defaultRegione.

// REGIONI
//  0 = ABRUZZO
//  1 = BASILICATA
//  2 = CALABRIA
//  3 = CAMPANIA
//  4 = EMILIA-ROMAGNA
//  5 = FRIULI-VENEZIA GIULIA
//  6 = LAZIO
//  7 = LIGURIA
//  8 = LOMBARDIA
//  9 = MARCHE
// 10 = MOLISE
// 11 = PROVINCIA AUTONOMA BOLZANO / BOZEN
// 12 = PROVINCIA AUTONOMA TRENTO
// 13 = PIEMONTE
// 14 = PUGLIA
// 15 = SARDEGNA
// 16 = SICILIA
// 17 = TOSCANA
// 18 = UMBRIA
// 19 = VALLE D'AOSTA / VALLÉE D'AOSTE
// 20 = VENETO

const sceltaRegione = "0" // Numero regione di default
let width = 100;
const h = 3;

if (!args.widgetParameter) {
  arg_regione = sceltaRegione
} else {
  arg_regione = args.widgetParameter
}

let indexRe = arg_regione
let infoV = await infoVaccini()
let valore = await vacciniPerRegione(infoV)
let widget = await createWidget(infoV)
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete()

async function createWidget(api) {
  let appIcon = await loadAppIcon()
  let widget = new ListWidget()
  // Add background gradient
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("000000"),
    new Color("0099ff")
  ]
  widget.backgroundGradient = gradient

  const upperStack = widget.addStack();
  upperStack.layoutHorizontally();

  const upperTextStack = upperStack.addStack();
  upperTextStack.layoutVertically();
 
  let staticText_titolo = upperTextStack.addText("Vaccinazioni");
  staticText_titolo.font = Font.boldRoundedSystemFont(13);
  staticText_titolo.textColor = Color.white()
  
  widget.addSpacer(1);

  let staticText_italia = upperTextStack.addText(valore.nomeRe);
  staticText_italia.font = Font.semiboldRoundedSystemFont(12);
  staticText_italia.textColor = Color.white()
  upperStack.addSpacer();

  let logoImage = upperStack.addImage(appIcon);
  logoImage.imageSize = new Size(30, 30);

  widget.addSpacer(2);
  
  let titleDS = widget.addText("Dosi Somministrate")
  titleDS.textColor = Color.white()
  titleDS.font = Font.boldSystemFont(11)
  //widget.addSpacer(2)
  let dosiSomministrate = widget.addText(valore.dosiSom)
  dosiSomministrate.textColor = Color.green()
  dosiSomministrate.font = Font.boldSystemFont(13)
  //widget.addSpacer(2)
  let titleDC = widget.addText("Dosi Consegnate")
  titleDC.textColor = Color.white()
  titleDC.font = Font.boldSystemFont(11)
  //widget.addSpacer(2)
  let dosiConsegnate = widget.addText(valore.dosiCons)
  dosiConsegnate.textColor = Color.red()
  dosiConsegnate.font = Font.boldSystemFont(13)

  widget.addSpacer(2)
  let titlePS = widget.addText(valore.percSom + "% Dosi Somm.")
  titlePS.textColor = Color.yellow()
  titlePS.font = Font.boldSystemFont(11)
  widget.addSpacer(2)
  
  if (valore.percSom.toLocaleString() < 30) {
    var colore_barra = new Color("#f60000");
  } else if (valore.percSom.toLocaleString() < 50) {
    var colore_barra = new Color("#dd0000");
  } else if (valore.percSom.toLocaleString() < 85) {
    var colore_barra = new Color("#fa6607");
  } else {
    var colore_barra = new Color("#40b000");
  }
  
  let progressStack = widget.addStack();
  progressStack.layoutVertically();
  let progressNumberStack = widget.addStack();
  progressNumberStack.layoutHorizontally();
  const progressText0 = progressNumberStack.addText("0%");
  progressText0.font = Font.mediumSystemFont(8);
  progressText0.textColor = Color.white();
  progressNumberStack.addSpacer();
  const progressText100 = progressNumberStack.addText("100%");
  progressText100.font = Font.mediumSystemFont(8); 
  progressText100.textColor = Color.white();
  progressStack.addImage(createProgress(valore.percSom, colore_barra));
  widget.addSpacer(1)
  /*let ultimoAggiornamento = widget.addText("Agg. " + valore.dataAgg);
  ultimoAggiornamento.textColor = Color.white();
  ultimoAggiornamento.font = Font.mediumMonospacedSystemFont(5);
  ultimoAggiornamento.textOpacity = 0.7;
  ultimoAggiornamento.centerAlignText();*/
  
  return widget
}

async function infoVaccini() {
  let docs = await loadDocs()
  var result = Object.entries(docs)

  return result
}

async function vacciniPerRegione(result) {
    for (var i = result.length - 1; i >= 0; i--) {
      let currentItem = result[i];
      let nomeReg = currentItem[1][indexRe]["nome_area"]
      let dosiSomm = formatNumber(currentItem[1][indexRe]["dosi_somministrate"])
      let dosiConse = formatNumber(currentItem[1][indexRe]["dosi_consegnate"])
      let percSomm = currentItem[1][indexRe]["percentuale_somministrazione"].toString()
      let dataAggiornamento = new Date(currentItem[1][indexRe]["ultimo_aggiornamento"]).toLocaleString() 
      //dataAggiornamento Non ancora inserita per motivi di spazio nel widget

      return {
        nomeRe: nomeReg,
        dosiSom: dosiSomm,
        dosiCons: dosiConse,
        percSom: percSomm,
        dataAgg: dataAggiornamento
      }
    }
  }

async function loadDocs() {
  let url = "https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json"
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadAppIcon() {
  let url = "https://www.governo.it/it/cscovid19/report-vaccini/logo.png"
  let req = new Request(url)
  return req.loadImage()
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function createProgress(percSomm, color_barra) {
    const context = new DrawContext();
    context.size = new Size(width, h);
    context.opaque = false;
    context.respectScreenScale = true;
    context.setFillColor(new Color("#d2d2d7"));
    const path = new Path();
    path.addRoundedRect(new Rect(0, 0, width, h), 3, 2);
    context.addPath(path);
    context.fillPath();
    context.setFillColor(color_barra);
    const path1 = new Path();
    const path1width = 
      Number(percSomm) > width
      ? width
      : Number(percSomm);
    path1.addRoundedRect(new Rect(0, 0, path1width, h), 3, 2);
    context.addPath(path1);
    context.fillPath();
    return context.getImage();
  }
