// INFO COVID-19 ITALIA PER REGIONE v.1.0
// Developer by Gualty@GitHub https://github.com/Gualty
// Questo script estrapola i dati forniti dal Dipartimento di Protezione Civile e mostra quelli della regione scelta
// Fonte: https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json
// Pagina GitHub ufficiale "Dati COVID-19 Italia": https://github.com/pcm-dpc/COVID-19

// From an idea of sebasanblas@Github https://gist.github.com/sebasanblas/d3638867a99c4d84942c159b88bb4096 and
// marco79cgn@Github (https://gist.github.com/marco79cgn/b5f291d6242a2c530e56c748f1ae7f2c)

// SELEZIONA REGIONE
// Puoi scegliere la regione impostando i parametri da passare allo script oppure modificando il valore qui sotto di sceltaRegione.

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

if (!args.widgetParameter) {
  arg_regione = sceltaRegione
} else {
  arg_regione = args.widgetParameter
}

let indexRe = arg_regione
let infoV = await infoCOVID()
let valore = await contagiPerRegione(infoV)
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
    new Color("0099ff"),
    new Color("000000")
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

  let staticText_italia = upperTextStack.addText(valore.nomeRe);
  staticText_italia.font = Font.semiboldRoundedSystemFont(12);
  staticText_italia.textColor = Color.white()
  upperStack.addSpacer();

  let logoImage = upperStack.addImage(appIcon);
  logoImage.imageSize = new Size(30, 30);

  widget.addSpacer(2);

  let titleDS = widget.addText("Nuovi Positivi")
  titleDS.textColor = Color.white()
  titleDS.font = Font.boldSystemFont(11)
  widget.addSpacer(2)
  let dosiSomministrate = widget.addText(valore.nuoviPos)
  dosiSomministrate.textColor = Color.green()
  dosiSomministrate.font = Font.boldSystemFont(17)
  widget.addSpacer(2)
  let titleDC = widget.addText("Contagi attuali")
  titleDC.textColor = Color.white()
  titleDC.font = Font.boldSystemFont(11)
  widget.addSpacer(2)
  let dosiConsegnate = widget.addText(valore.contagiAtt)
  dosiConsegnate.textColor = Color.red()
  dosiConsegnate.font = Font.boldSystemFont(17)
  widget.addSpacer(4)
  let titlePS = widget.addText("Aggiornamento")
  titlePS.textColor = Color.white()
  titlePS.font = Font.boldSystemFont(11)
  widget.addSpacer(1)
  let percSomministrate = widget.addText(valore.dataAgg)
  percSomministrate.textColor = Color.yellow()
  percSomministrate.font = Font.boldSystemFont(11)

  return widget
}

async function infoCOVID() {
  let docs = await loadDocs()
  var result = Object.entries(docs)

  return result
}

async function contagiPerRegione(result) {
      let nomeReg = result[indexRe][1]["denominazione_regione"]
      let nuoviPositivi = formatNumber(result[indexRe][1]["nuovi_positivi"])
      let contagiAttuali = formatNumber(result[indexRe][1]["totale_positivi"])
      let dataAggiornamento = new Date(result[indexRe][1]["data"]).toLocaleString()
      return {
        nomeRe: nomeReg,
        nuoviPos: nuoviPositivi,
        contagiAtt: contagiAttuali,
        dataAgg: dataAggiornamento
      }
    }


async function loadDocs() {
  let url = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json"
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
