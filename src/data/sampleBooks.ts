import { Book, Bookmark, DailyListeningStat } from '../types/audiobook';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-dom-casmurro',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    narrator: 'Carlos Silveira',
    folderPath: '/Armazenamento/Audiobooks/Machado de Assis/Dom Casmurro',
    coverColor: '#b45309', // Warm amber / leather brown
    coverArtStyle: 'machado',
    totalDurationSeconds: 28800, // 8 hours
    currentPositionSeconds: 4320, // 1h 12m
    currentChapterId: 'dc-cap-03',
    isCompleted: false,
    lastPlayedAt: Date.now() - 3600000 * 2,
    chapters: [
      {
        id: 'dc-cap-01',
        bookId: 'book-dom-casmurro',
        index: 1,
        title: 'Capítulo I — Do Título',
        durationSeconds: 780,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '01_Do_Titulo.mp3',
        fileSizeFormatted: '18.4 MB',
        textExcerpt: 'Uma noite destas, vindo da cidade para o Engenho Novo, encontrei num trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu. Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos...'
      },
      {
        id: 'dc-cap-02',
        bookId: 'book-dom-casmurro',
        index: 2,
        title: 'Capítulo II — Do Livro',
        durationSeconds: 1140,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '02_Do_Livro.mp3',
        fileSizeFormatted: '26.8 MB',
        textExcerpt: 'Agora que expliquei o título, passo a escrever o livro. Antes disso, porém, digamos os motivos que me põem a pena na mão. Vivo só, com um criado. A casa em que moro é própria; foi construída por mim há vinte anos...'
      },
      {
        id: 'dc-cap-03',
        bookId: 'book-dom-casmurro',
        index: 3,
        title: 'Capítulo III — A Denúncia',
        durationSeconds: 1420,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '03_A_Denuncia.mp3',
        fileSizeFormatted: '33.2 MB',
        textExcerpt: 'Ia a entrar na sala de visitas, quando ouvi proferir o meu nome e escondi-me atrás da porta. A casa era a da Rua de Matacavalos, o mês novembro, o ano é que é um tanto remoto, mas eu não hei de trocar as datas da minha vida só para agradar aos que não amam velhices...'
      },
      {
        id: 'dc-cap-04',
        bookId: 'book-dom-casmurro',
        index: 4,
        title: 'Capítulo IV — Um Dever Amaríssimo',
        durationSeconds: 1260,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '04_Um_Dever_Amarissimo.mp3',
        fileSizeFormatted: '29.5 MB',
        textExcerpt: 'José Dias suspirou. Minha mãe não respondeu nada. Foi ele quem continuou, dizendo que o Bento estava já na idade de ir para o seminário. Minha mãe fez uma promessa há muitos anos de fazer do filho um padre...'
      },
      {
        id: 'dc-cap-05',
        bookId: 'book-dom-casmurro',
        index: 5,
        title: 'Capítulo V — Olhos de Ressaca',
        durationSeconds: 1650,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '05_Olhos_De_Ressaca.mp3',
        fileSizeFormatted: '38.7 MB',
        textExcerpt: 'Capitu era Capitu, isto é, uma criatura muito particular, mais mulher do que eu era homem. Se ainda não disse, digo-o agora: tinha uns olhos de cigana oblíqua e dissimulada. Olhos de ressaca? Olhos de ressaca, vá...'
      }
    ]
  },
  {
    id: 'book-alienista',
    title: 'O Alienista',
    author: 'Machado de Assis',
    narrator: 'Renato Godinho',
    folderPath: '/Armazenamento/Audiobooks/Machado de Assis/O Alienista',
    coverColor: '#047857', // Dark emerald
    coverArtStyle: 'alienista',
    totalDurationSeconds: 14400, // 4 hours
    currentPositionSeconds: 2150,
    currentChapterId: 'al-cap-02',
    isCompleted: false,
    lastPlayedAt: Date.now() - 3600000 * 24,
    chapters: [
      {
        id: 'al-cap-01',
        bookId: 'book-alienista',
        index: 1,
        title: 'Capítulo I — De Como Itaguaí Ganhou Uma Casa de Orates',
        durationSeconds: 1350,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '01_Casa_De_Orates.mp3',
        fileSizeFormatted: '31.1 MB',
        textExcerpt: 'As crônicas da vila de Itaguaí dizem que em tempos remotos um médico de nome Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil, de Portugal e das Espanhas, fundou a Casa Verde...'
      },
      {
        id: 'al-cap-02',
        bookId: 'book-alienista',
        index: 2,
        title: 'Capítulo II — Torrente de Loucos',
        durationSeconds: 1480,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '02_Torrente_De_Loucos.mp3',
        fileSizeFormatted: '34.5 MB',
        textExcerpt: 'Três dias depois da inauguração, a Casa Verde tinha já vinte hóspedes. A notícia correu a vila e os arredores. Pais de família, maridos aflitos, amigos zelosos começaram a descarregar os seus loucos no asilo...'
      },
      {
        id: 'al-cap-03',
        bookId: 'book-alienista',
        index: 3,
        title: 'Capítulo III — A Revolta dos Canjicas',
        durationSeconds: 1820,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '03_Revolta_Dos_Canjicas.mp3',
        fileSizeFormatted: '42.0 MB',
        textExcerpt: 'A vila inteira revoltou-se contra o alienista. O barbeiro Porfírio, armado de palavras e de um trabuco, liderou a multidão de cidadãos assustados que exigiam a libertação dos recolhidos na Casa Verde...'
      }
    ]
  },
  {
    id: 'book-20k-mil-leguas',
    title: 'Vinte Mil Léguas Submarinas',
    author: 'Júlio Verne',
    narrator: 'Eduardo Martins',
    folderPath: '/Armazenamento/Audiobooks/Julio Verne/Vinte Mil Leguas',
    coverColor: '#0e7490', // Ocean cyan / deep navy
    coverArtStyle: 'verne',
    totalDurationSeconds: 43200, // 12 hours
    currentPositionSeconds: 43200,
    currentChapterId: 'vl-cap-01',
    isCompleted: true,
    lastPlayedAt: Date.now() - 3600000 * 48,
    chapters: [
      {
        id: 'vl-cap-01',
        bookId: 'book-20k-mil-leguas',
        index: 1,
        title: 'Capítulo I — Um Esculhador de Mares',
        durationSeconds: 2100,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '01_Um_Esculhador_De_Mares.mp3',
        fileSizeFormatted: '48.2 MB',
        textExcerpt: 'O ano de 1866 ficou assinalado por um estranho acontecimento, um fenômeno inexplicado e inexplicável que certamente ninguém esqueceu. Vários navios encontraram em alto mar um monstro gigante fosforescente...'
      },
      {
        id: 'vl-cap-02',
        bookId: 'book-20k-mil-leguas',
        index: 2,
        title: 'Capítulo II — O Capitão Nemo e o Nautilus',
        durationSeconds: 2540,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '02_Capitao_Nemo.mp3',
        fileSizeFormatted: '58.0 MB',
        textExcerpt: 'O capitão Nemo fixou os seus olhos profundos em mim: Professor Aronnax, não sou o que os senhores chamam de homem civilizado! Rompi de todo com a sociedade inteira por razões que só a mim dizem respeito...'
      }
    ]
  },
  {
    id: 'book-cartomante',
    title: 'A Cartomante e Outros Contos',
    author: 'Machado de Assis',
    narrator: 'Beatriz Fagundes',
    folderPath: '/Armazenamento/Audiobooks/Machado de Assis/A Cartomante',
    coverColor: '#6d28d9', // Royal violet
    coverArtStyle: 'classic',
    totalDurationSeconds: 7200, // 2 hours
    currentPositionSeconds: 1540,
    currentChapterId: 'ct-cap-01',
    isCompleted: false,
    lastPlayedAt: Date.now() - 3600000 * 5,
    chapters: [
      {
        id: 'ct-cap-01',
        bookId: 'book-cartomante',
        index: 1,
        title: 'A Cartomante',
        durationSeconds: 1980,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '01_A_Cartomante.mp3',
        fileSizeFormatted: '44.8 MB',
        textExcerpt: 'Hamlet observa a Horácio que há mais cousas no céu e na terra do que sonha a nossa vã filosofia. Era a mesma explicação que dava a bela Rita ao moço Camilo, numa sexta-feira de novembro de 1869...'
      },
      {
        id: 'ct-cap-02',
        bookId: 'book-cartomante',
        index: 2,
        title: 'Missa do Galo',
        durationSeconds: 1620,
        audioSrc: 'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
        fileName: '02_Missa_Do_Galo.mp3',
        fileSizeFormatted: '37.1 MB',
        textExcerpt: 'Nunca pude entender a conversação que tive com uma senhora, há muitos anos, contava eu dezessete, ela trinta. Era noite de Natal. Havendo ajustado com um vizinho irmos à missa do galo, preferi não dormir...'
      }
    ]
  }
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-1',
    bookId: 'book-dom-casmurro',
    bookTitle: 'Dom Casmurro',
    chapterId: 'dc-cap-03',
    chapterTitle: 'Capítulo III — A Denúncia',
    timestampSeconds: 320,
    title: 'José Dias denuncia Bentinho e Capitu',
    notes: 'Momento chave onde José Dias sussurra a Dona Glória sobre a proximidade entre os jovens.',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'bm-2',
    bookId: 'book-dom-casmurro',
    bookTitle: 'Dom Casmurro',
    chapterId: 'dc-cap-05',
    chapterTitle: 'Capítulo V — Olhos de Ressaca',
    timestampSeconds: 145,
    title: 'A definição clássica de Capitu',
    notes: 'Olhos de ressaca, que arrastam para dentro como o mar bravo.',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'bm-3',
    bookId: 'book-alienista',
    bookTitle: 'O Alienista',
    chapterId: 'al-cap-01',
    chapterTitle: 'Capítulo I — De Como Itaguaí Ganhou Uma Casa de Orates',
    timestampSeconds: 412,
    title: 'Discurso de Simão Bacamarte sobre a loucura',
    notes: 'A ciência como única verdade absoluta segundo o alienista.',
    createdAt: Date.now() - 86400000 * 3
  }
];

export const INITIAL_STATS: DailyListeningStat[] = [
  { date: '2026-10-22', minutesListened: 35, sessionsCount: 2 },
  { date: '2026-10-23', minutesListened: 48, sessionsCount: 3 },
  { date: '2026-10-24', minutesListened: 62, sessionsCount: 2 },
  { date: '2026-10-25', minutesListened: 25, sessionsCount: 1 },
  { date: '2026-10-26', minutesListened: 55, sessionsCount: 4 },
  { date: '2026-10-27', minutesListened: 74, sessionsCount: 3 },
  { date: '2026-10-28', minutesListened: 42, sessionsCount: 2 },
];
