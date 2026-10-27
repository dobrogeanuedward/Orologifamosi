export const areas = [
  {
    name: "Imola e via Emilia",
    towns: [
      "Castel San Pietro Terme",
      "Castel Guelfo di Bologna",
      "Imola",
      "Dozza",
      "Mordano",
      "Ozzano dell’Emilia",
      "San Lazzaro di Savena",
    ],
  },
  {
    name: "Pianura e nord-est",
    towns: [
      "Budrio",
      "Castenaso",
      "Granarolo dell’Emilia",
      "Molinella",
      "Bentivoglio",
      "Castel Maggiore",
      "San Pietro in Casale",
      "Malalbergo",
      "Baricella",
      "Minerbio",
      "Argenta",
    ],
  },
  {
    name: "Cintura ovest di Bologna",
    towns: [
      "Casalecchio di Reno",
      "Zola Predosa",
      "Calderara di Reno",
      "Anzola dell’Emilia",
      "San Giovanni in Persiceto",
    ],
  },
  {
    name: "Prima bassa Romagna",
    towns: [
      "Castel Bolognese",
      "Bagnara di Romagna",
      "Massa Lombarda",
      "Conselice",
      "Lugo",
    ],
  },
];
export function coverageFaqs(brand: string) {
  const subject = brand || "orologio di lusso";
  return [
    {
      q: `Posso vendere il mio ${subject} online?`,
      a: `Puoi avviare la richiesta di valutazione online, anche da altre parti d’Italia. Invia i dettagli e le foto a Orologi Famosi: il primo confronto a distanza non è una certificazione né un acquisto concluso. Prima di qualsiasi spedizione o consegna, concorda con Salvatore verifiche, modalità, eventuali costi e pagamento.`,
    },
    {
      q: `Quali foto servono per valutare ${brand ? "un " + brand : "un orologio usato"}?`,
      a: "Fotografa il quadrante frontalmente, i lati della cassa, il fondello, il bracciale o cinturino e la chiusura. Aggiungi scatola, garanzia e accessori disponibili. Usa luce naturale, immagini a fuoco e senza filtri; non aprire né smontare l’orologio. Condividi eventuali dati identificativi soltanto nel confronto diretto con Salvatore.",
    },
    {
      q: `Come incide il corredo sul valore${brand ? " di un " + brand : ""}?`,
      a: "Scatola, garanzia e documenti contribuiscono alla ricostruzione della storia e della dotazione. Se hai solo la scatola, solo i documenti o nessuno dei due, comunicalo: puoi comunque presentare una richiesta. Non esiste una maggiorazione fissa valida per ogni modello; la proposta dipende dall’esemplare e dalle verifiche.",
    },
    {
      q: `Chi compra ${brand ? brand + " usati" : "orologi usati"} a Bologna e Medicina?`,
      a: `Orologi Famosi di Salvatore Agresta esamina richieste di acquisto ${brand ? "di " + brand : "di orologi di lusso"} da privati. Se abiti a Bologna puoi iniziare a distanza; la sede per le valutazioni su appuntamento è a Medicina, Centro Commerciali Medici, Via Fava 421/14. Un appuntamento serve al confronto e non comporta un obbligo di vendita.`,
    },
  ];
}
