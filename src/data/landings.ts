export interface Landing {
  slug: string;
  brand: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  note: string;
  modelTitle: string;
  modelIntro: string;
  models: { name: string; text: string }[];
  factors: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
}
export const landings: Landing[] = [
  {
    slug: "vendi-orologio",
    brand: "",
    title: "Vendi il tuo orologio | Orologi Famosi, Medicina e Bologna",
    description:
      "Vuoi vendere un orologio di lusso? Richiedi una valutazione a Salvatore Agresta. Orologi Famosi riceve su appuntamento a Medicina, in provincia di Bologna.",
    heading: "Vendi il tuo\norologio.",
    intro:
      "Vuoi vendere un orologio di lusso? Salvatore Agresta valuta il tuo esemplare, le sue condizioni e il corredo. Inizia con poche informazioni e qualche foto.",
    image: "hero.webp",
    imageAlt:
      "Esame di un orologio e del suo corredo al tavolo di Orologi Famosi",
    note: "Una valutazione, prima di ogni decisione.",
    modelTitle: "Partiamo dal tuo orologio.",
    modelIntro:
      "Rolex, Omega, Cartier e gli altri marchi del catalogo Orologi Famosi. Ogni richiesta viene esaminata singolarmente: l’interesse all’acquisto dipende dall’esemplare.",
    models: [
      {
        name: "Rolex",
        text: "Submariner, Datejust, Daytona e altri modelli. Referenza e configurazione fanno la differenza.",
      },
      {
        name: "Omega",
        text: "Speedmaster, Seamaster e altre collezioni. Contano versione, movimento e conservazione.",
      },
      {
        name: "Cartier",
        text: "Santos, Tank e altri modelli. Misura, materiale e corredo aiutano a identificare il tuo esemplare.",
      },
    ],
    factors: [
      {
        title: "Modello e referenza",
        text: "Due orologi simili possono avere valori diversi. La referenza aiuta a riconoscere la versione esatta.",
      },
      {
        title: "Condizioni reali",
        text: "Cassa, vetro, quadrante, bracciale e funzionamento si valutano insieme. Segnala eventuali interventi.",
      },
      {
        title: "Scatola e documenti",
        text: "Garanzia, corredo e fatture di manutenzione completano la storia dell’orologio. Dicci cosa hai conservato.",
      },
    ],
    faqs: [
      {
        q: "Quanto vale il mio orologio?",
        a: "Invia marca, modello o referenza, condizioni e foto nitide. Salvatore esamina le informazioni per un primo confronto. Un’offerta definitiva richiede la verifica dell’orologio: una fotografia da sola non ne certifica autenticità e funzionamento.",
      },
      {
        q: "E se non ho scatola o documenti?",
        a: "Sì, puoi presentare una richiesta anche senza corredo. Indica ciò che manca: disponibilità dei documenti, condizioni e possibilità di identificare l’esemplare incidono sulla valutazione e sull’eventuale acquisto.",
      },
      {
        q: "Acquistate qualsiasi modello?",
        a: "Ogni esemplare viene esaminato singolarmente. La presenza di un marchio non comporta un impegno ad acquistare qualsiasi modello o un’offerta automatica.",
      },
      {
        q: "Posso contattarvi da un’altra città?",
        a: "Puoi iniziare a distanza inviando informazioni e fotografie. Gli appuntamenti in sede si concordano a Medicina, in provincia di Bologna. Per altre modalità di consegna o ritiro, parlane prima con Salvatore.",
      },
    ],
  },
  {
    slug: "vendi-rolex",
    brand: "Rolex",
    title:
      "Vendi Rolex usato | Valutazione a Medicina, Bologna | Orologi Famosi",
    description:
      "Vuoi vendere un Rolex Submariner, Datejust o Daytona? Richiedi una valutazione del tuo esemplare a Orologi Famosi. Appuntamenti a Medicina, Bologna.",
    heading: "Vendi il tuo\nRolex.",
    intro:
      "Una referenza, un quadrante, il corredo originale. Prima di vendere il tuo Rolex, confrontati con Salvatore: la valutazione parte dalle caratteristiche del tuo esemplare.",
    image: "slide6.webp",
    imageAlt: "Un Rolex esaminato durante un confronto presso Orologi Famosi",
    note: "Il tuo esemplare, oltre il nome sul quadrante.",
    modelTitle: "Quale Rolex vuoi vendere?",
    modelIntro:
      "La famiglia è il punto di partenza. Referenza, anno, materiale e configurazione permettono di distinguere il tuo Rolex da un altro dello stesso modello.",
    models: [
      {
        name: "Submariner",
        text: "Date e No Date, referenze recenti e vintage. Indica la referenza e fotografa quadrante, lunetta e bracciale.",
      },
      {
        name: "Datejust",
        text: "Misura, metallo, quadrante, lunetta e bracciale distinguono configurazioni molto diverse.",
      },
      {
        name: "Daytona e altri Rolex",
        text: "Daytona, GMT-Master, Explorer, Air-King, Day-Date: descrivi il tuo esemplare, oltre al nome della collezione.",
      },
    ],
    factors: [
      {
        title: "Configurazione esatta",
        text: "Referenza, misura, metallo, quadrante e bracciale identificano il Rolex e permettono confronti pertinenti.",
      },
      {
        title: "Conservazione e interventi",
        text: "Segni, lucidature, parti sostituite e revisioni contribuiscono al giudizio. Le fatture disponibili sono utili.",
      },
      {
        title: "Corredo e provenienza",
        text: "Scatola, garanzia e documenti vanno descritti con precisione. Non pubblicare numeri seriali completi.",
      },
    ],
    faqs: [
      {
        q: "Quanto vale oggi il mio Rolex usato?",
        a: "Non esiste un prezzo unico per tutti i Rolex di una collezione. Referenza, configurazione, condizioni, corredo e mercato dell’esemplare incidono sulla proposta. Invia i dati per un esame specifico: il prezzo di un annuncio non equivale necessariamente a un prezzo di acquisto.",
      },
      {
        q: "Posso proporre un Rolex vintage?",
        a: "Sì. Specifica referenza, anno se noto, interventi e documenti disponibili. Foto di quadrante, cassa e bracciale aiutano il primo esame; originalità e condizioni richiedono una verifica diretta.",
      },
      {
        q: "Dove trovo la referenza del Rolex?",
        a: "Può essere riportata sui documenti dell’orologio. Se non la conosci, invia foto e informazioni disponibili: non aprire l’orologio e non smontare il bracciale per cercarla.",
      },
      {
        q: "Serve la garanzia per vendere un Rolex?",
        a: "Puoi sottoporre l’orologio anche senza garanzia. Comunicalo subito: l’assenza del corredo è un elemento della valutazione e l’eventuale acquisto resta subordinato alle verifiche sull’esemplare.",
      },
    ],
  },
  {
    slug: "vendi-omega",
    brand: "Omega",
    title: "Vendi Omega usato | Speedmaster e Seamaster | Orologi Famosi",
    description:
      "Valutazione Omega usati: Speedmaster, Seamaster e altre collezioni. Invia i dettagli a Orologi Famosi, su appuntamento a Medicina, in provincia di Bologna.",
    heading: "Vendi il tuo\nOmega.",
    intro:
      "Speedmaster, Seamaster o un altro Omega: raccontaci quale possiedi. Salvatore esamina referenza, condizioni e documenti per valutare una possibile proposta d’acquisto.",
    image: "omega.webp",
    imageAlt: "Omega Speedmaster fotografato da Orologi Famosi",
    note: "Dalla collezione all’esemplare. Nessuna stima automatica.",
    modelTitle: "Il nome è solo l’inizio.",
    modelIntro:
      "Anche nella stessa famiglia Omega cambiano dimensioni, movimenti e generazioni. La referenza aiuta a capire esattamente quale orologio vuoi vendere.",
    models: [
      {
        name: "Speedmaster",
        text: "Moonwatch, Reduced e altre versioni richiedono confronti diversi. Indica referenza e movimento, se li conosci.",
      },
      {
        name: "Seamaster",
        text: "Diver, Aqua Terra, Planet Ocean e versioni vintage: specifica collezione, misura e materiale.",
      },
      {
        name: "Altri Omega",
        text: "Constellation, De Ville e altre collezioni possono essere proposte per un esame. L’interesse viene verificato caso per caso.",
      },
    ],
    factors: [
      {
        title: "Versione e movimento",
        text: "Referenza e documenti distinguono versioni manuali, automatiche e al quarzo. Non serve aprire l’orologio.",
      },
      {
        title: "Manutenzione",
        text: "Descrivi il funzionamento, l’ultima revisione documentata, eventuali difetti o parti sostituite.",
      },
      {
        title: "Dotazione",
        text: "Scatola, garanzia, maglie aggiuntive e fatture aiutano a ricostruire la configurazione e la storia dell’esemplare.",
      },
    ],
    faqs: [
      {
        q: "Speedmaster Moonwatch e Reduced hanno lo stesso valore?",
        a: "Sono orologi differenti: referenze, dimensioni e movimenti non coincidono. La valutazione va fatta sul modello preciso, non soltanto sul nome Speedmaster.",
      },
      {
        q: "Posso vendere un Omega vintage?",
        a: "Puoi inviare la richiesta con tutte le informazioni che conosci e foto chiare. Condizioni, interventi e originalità delle parti richiedono un esame specifico prima di una proposta definitiva.",
      },
      {
        q: "Valutate Omega non funzionanti?",
        a: "Segnala subito che l’orologio non funziona e descrivi il problema, se noto. Salvatore verifica se l’esemplare è d’interesse; la richiesta non garantisce una proposta d’acquisto.",
      },
      {
        q: "Dove posso far valutare un Omega vicino a Bologna?",
        a: "Orologi Famosi riceve su appuntamento a Medicina, in provincia di Bologna. Puoi iniziare su WhatsApp con referenza e fotografie prima di concordare una visita.",
      },
    ],
  },
  {
    slug: "vendi-cartier",
    brand: "Cartier",
    title: "Vendi Cartier usato | Santos e Tank | Orologi Famosi Bologna",
    description:
      "Vuoi vendere un Cartier Santos o Tank? Richiedi una valutazione a Orologi Famosi. Si riceve su appuntamento a Medicina, Bologna.",
    heading: "Vendi il tuo\nCartier.",
    intro:
      "Santos, Tank e altre collezioni: misura, materiale e movimento raccontano esemplari diversi. Parti da un confronto diretto con Salvatore, prima di decidere se vendere.",
    image: "cartier.webp",
    imageAlt: "Cartier Santos fotografato da Orologi Famosi",
    note: "Forma, misura, dettagli. Il valore è nell’insieme.",
    modelTitle: "Quale Cartier possiedi?",
    modelIntro:
      "Una foto e la referenza aiutano a distinguere versione, misura e materiale. Non è necessario conoscere già tutti i dettagli tecnici per iniziare.",
    models: [
      {
        name: "Santos",
        text: "Santos de Cartier, Santos Galbée e Santos-Dumont: nome, dimensioni e movimento identificano famiglie differenti.",
      },
      {
        name: "Tank",
        text: "Tank Must, Louis Cartier, Française e altre versioni: specifica misura, materiale e documenti disponibili.",
      },
      {
        name: "Altri Cartier",
        text: "Ballon Bleu, Pasha e altre collezioni possono essere sottoposte per un primo esame, con interesse da verificare sul singolo esemplare.",
      },
    ],
    factors: [
      {
        title: "Misura e materiale",
        text: "Acciaio, oro, configurazioni bicolore e misure differenti richiedono confronti specifici.",
      },
      {
        title: "Movimento e condizioni",
        text: "Indica se automatico, manuale o al quarzo, quando noto. Segnala segni, stato del cinturino e funzionamento.",
      },
      {
        title: "Corredo e accessori",
        text: "Garanzia, scatola, maglie e cinturini aggiuntivi completano la descrizione del Cartier che vuoi proporre.",
      },
    ],
    faqs: [
      {
        q: "Quanto vale un Cartier Tank usato?",
        a: "Dipende dalla versione. Tank Must e Tank Louis Cartier, per esempio, non sono intercambiabili. Referenza, misura, materiale, movimento e condizioni guidano una valutazione del singolo orologio.",
      },
      {
        q: "Posso proporre un Cartier al quarzo?",
        a: "Sì, indica che il movimento è al quarzo e se l’orologio funziona. L’interesse all’acquisto e la proposta vengono verificati sull’esemplare.",
      },
      {
        q: "Posso vendere il Cartier senza cinturino originale?",
        a: "Puoi inviare la richiesta specificando quali parti o accessori sono stati sostituiti. Configurazione e dotazione disponibili contribuiscono alla valutazione.",
      },
      {
        q: "Come vendo un Cartier da Bologna o da Modena?",
        a: "Inizia inviando dettagli e foto su WhatsApp. La sede per gli appuntamenti è a Medicina, in provincia di Bologna; concorda con Salvatore ogni modalità alternativa di verifica o consegna.",
      },
    ],
  },
];
