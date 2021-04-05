// INFO COVID-19 WORLD v.1.0
// Developer by Gualty@GitHub https://github.com/Gualty
// Questo script estrapola i dati forniti da https://coronavirus-19-api.herokuapp.com/ e mostra la nazione scelta
// Fonte: https://coronavirus-19-api.herokuapp.com/countries/https://coronavirus-19-api.herokuapp.com/countries/

// From an idea of sebasanblas@Github https://gist.github.com/sebasanblas/d3638867a99c4d84942c159b88bb4096 and
// marco79cgn@Github (https://gist.github.com/marco79cgn/b5f291d6242a2c530e56c748f1ae7f2c)

// SELEZIONA NAZIONE
// Puoi scegliere la regione impostando i parametri da passare allo script oppure modificando il valore qui sotto di defaultRegione.

// REGIONI
//  0 = World
//  1 = USA
//  2 = Brazil
//  3 = India
//  4 = France
//  5 = Russia
//  6 = UK
//  7 = Italy
//  8 = Turkey
//  9 = Spain
// 10 = Germany
// 11 = Poland
// 12 = Colombia
// 13 = Argentina
// 14 = Mexico
// 15 = Iran
// 16 = Ukraine
// 17 = Peru
// 18 = Czechia
// 19 = South Africa
// 20 = Indonesia
// 21 = Netherlands
// 22 = Chile
// 23 = Canada
// 24 = Romania
// 25 = Belgium
// 26 = Iraq
// 27 = Israel
// 28 = Portugual
// 28 = Sweden
// 29 = Philippines
// 30 = Pakistan
// Per visualizzare tutte le nazioni visita https://coronavirus-19-api.herokuapp.com/countries/ e calcola il numero della 
// nazione in base alla posizione partendo dal numero 0 che corrisponde a WORLD, 1 USA, 7 Italy.

const sceltaNazione = "0" // Numero Nazione di default - 0 = WORLD

if (!args.widgetParameter) {
  arg_nazione = sceltaNazione
} else {
  arg_nazione = args.widgetParameter
}

let indexSt = arg_nazione
let infoV = await infoCOVID()
let valore = await contagiPerNazione(infoV)
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
    new Color("#03396c"),
    new Color("#005b96")
  ]
  widget.backgroundGradient = gradient

  const upperStack = widget.addStack();
  upperStack.layoutHorizontally();

  const upperTextStack = upperStack.addStack();
  upperTextStack.layoutVertically();

  let staticText_titolo = upperTextStack.addText("COVID-19");
  staticText_titolo.font = Font.boldRoundedSystemFont(13);
  staticText_titolo.textColor = Color.white()
  
  widget.addSpacer(1);

  let staticText_italia = upperTextStack.addText(valore.nomeNaz);
  staticText_italia.font = Font.semiboldRoundedSystemFont(12);
  staticText_italia.textColor = Color.white()
  upperStack.addSpacer();

  let logoImage = upperStack.addImage(appIcon);
  logoImage.imageSize = new Size(30, 30);

  widget.addSpacer(2);
  
  let titleDS = widget.addText("Totale Casi")
  titleDS.textColor = Color.white()
  titleDS.font = Font.boldSystemFont(11)
  //widget.addSpacer(2)
  let dosiSomministrate = widget.addText(valore.totaleCas)
  dosiSomministrate.textColor = Color.orange()
  dosiSomministrate.font = Font.boldSystemFont(17)
  widget.addSpacer(2)
  let titleDC = widget.addText("Contagi attuali")
  titleDC.textColor = Color.white()
  titleDC.font = Font.boldSystemFont(11)
  //widget.addSpacer(2)
  let dosiConsegnate = widget.addText(valore.contagiAtt)
  dosiConsegnate.textColor = Color.yellow()
  dosiConsegnate.font = Font.boldSystemFont(17)
  widget.addSpacer(2)
  let titlePS = widget.addText("Morti")
  titlePS.textColor = Color.white()
  titlePS.font = Font.boldSystemFont(11)
  widget.addSpacer(1)
  let percSomministrate = widget.addText(valore.totaleMort)
  percSomministrate.textColor = Color.red()
  percSomministrate.font = Font.boldSystemFont(17)

  return widget
}

async function infoCOVID() {
  let docs = await loadDocs()
  var result = Object.values(docs)
  
  return result
}

async function contagiPerNazione(result) {
      let nomeNazione = result[arg_nazione]["country"]
      let totaleCasi = formatNumber(result[arg_nazione]["cases"])
      let contagiAttuali = formatNumber(result[arg_nazione]["active"])
      let totaleMorti = formatNumber(result[arg_nazione]["deaths"])
      return {
        nomeNaz: nomeNazione,
        totaleCas: totaleCasi,
        contagiAtt: contagiAttuali,
        totaleMort: totaleMorti

      }
    }
 

async function loadDocs() {
  let url = "https://coronavirus-19-api.herokuapp.com/countries/"
  let req = new Request(url)
  return await req.loadJSON()
}

async function loadAppIcon() {
  let url = "https://www.flaticon.com/premium-icon/icons/svg/2890/2890039.svg"
  let req = new Request(url)
  return req.loadImage()
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
