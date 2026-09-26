import { Product } from '../types';

export const UNIT_PRICE = 20000;
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const WHATSAPP_PHONE = '221785426344';
export const WHATSAPP_DISPLAY = '+221 78 542 63 44';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export const PRODUCTS: Product[] = [
  {
    id: 'never-follow',
    name: 'Never Follow',
    chapterNo: '01',
    chapterTitle: 'NEVER FOLLOW.',
    colourway: 'Bordeaux / Rose poudré',
    views: [
      { label: 'Avant', src: '/img/never-follow-face.jpeg' },
      { label: 'Arrière', src: '/img/never-follow-dos.jpeg' },
    ],
    tagline: 'Le premier geste de la lettre : choisir sa direction.',
    story:
      "Tu n'as pas besoin de marcher dans des traces déjà dessinées. Never Follow ouvre la lettre par une décision : avancer dans ta direction même quand personne ne l'a prise avant toi. Empreinte et wordmark devant, lettrage peint à la main au dos, col et bords contrastés rose poudré.",
    details: [
      'T-shirt maille lourde, coupe oversize',
      'Empreinte et wordmark devant, lettrage brossé au dos',
      'Col ouvert et bandes contrastées rose poudré',
      'Étiquette tissée SOLD OUT au col',
    ],
    isNew: true,
  },
  {
    id: 'own-your-story',
    name: 'Own Your Story',
    chapterNo: '02',
    chapterTitle: 'OWN YOUR STORY.',
    colourway: 'Noir / Blanc',
    views: [
      { label: 'Avant', src: '/img/own-your-story-face.jpeg' },
      { label: 'Arrière', src: '/img/own-your-story-dos.jpeg' },
    ],
    tagline: "Ton histoire n'a pas besoin d'être parfaite pour être la tienne.",
    story:
      'Chaque détour, chaque décision, chaque victoire appartient à ton récit. Own Your Story le porte en grand : t-shirt col V à bandes blanches, empreinte et signature devant, lettrage brossé au dos, patch numéroté 01 en bas de la pièce.',
    details: [
      'T-shirt col V, coupe oversize',
      'Bandes doubles aux manches et au col',
      'Patch « 01 — Limited Edition » en bas de pièce',
      'Empreinte sérigraphiée devant et dos',
    ],
    isNew: true,
  },
  {
    id: 'built-different',
    name: 'Built Different',
    chapterNo: '03',
    chapterTitle: 'BUILT DIFFERENT.',
    colourway: 'Rose / Noir',
    views: [
      { label: 'Avant', src: '/img/built-different-face.jpeg' },
      { label: 'Arrière', src: '/img/built-different-dos.jpeg' },
    ],
    tagline: "Être différent n'est pas un accident. C'est une construction.",
    story:
      'La pièce signature du Drop 01. Maille mesh respirante rose, empreinte et wordmark devant, lettrage brossé noir au dos avec le rappel « Leave your mark. Be yourself. ». Built Different célèbre ce qui te distingue et le transforme en signature.',
    details: [
      'T-shirt maille mesh ajourée, toucher léger',
      'Col et poignets côtelés noir et rose',
      'Lettrage brossé grand format au dos',
      'Coupe oversize, épaules tombantes',
    ],
    isNew: true,
  },
  {
    id: 'the-one',
    name: 'The One',
    chapterNo: '04',
    chapterTitle: 'THE ONE.',
    colourway: 'Blanc optique',
    views: [
      { label: 'Avant', src: '/img/the-one-face.jpeg' },
      { label: 'Arrière', src: '/img/the-one-dos.jpeg' },
    ],
    tagline: 'Pas besoin de ressembler aux autres pour avoir sa place.',
    story:
      "The One parle de liberté : devenir une version de toi qu'aucune tendance ne peut reproduire. Empreinte et signature devant, lettrage brossé au dos, plis structurés aux épaules sur un jersey blanc épais.",
    details: [
      'T-shirt jersey coton lourd 240 g/m²',
      'Épaules structurées à plis',
      'Empreinte devant, lettrage brossé au dos',
      'Coupe boxy, tombé droit',
    ],
    isNew: false,
  },
];

export const LETTER_CHAPTERS = [
  {
    no: '01',
    title: 'NEVER FOLLOW.',
    productId: 'never-follow',
    body: 'Ne suis pas les traces déjà dessinées. Choisis ta direction, même lorsqu’elle est différente.',
  },
  {
    no: '02',
    title: 'OWN YOUR STORY.',
    productId: 'own-your-story',
    body: 'Ton histoire t’appartient. Porte-la avec ses détours, ses victoires et tout ce qui la rend unique.',
  },
  {
    no: '03',
    title: 'BUILT DIFFERENT.',
    productId: 'built-different',
    body: 'Ce qui te distingue n’est pas quelque chose à cacher. Fais-en ta signature.',
  },
  {
    no: '04',
    title: 'THE ONE.',
    productId: 'the-one',
    body: 'Tu n’as pas besoin de ressembler aux autres pour trouver ta place. Reste fidèle à la version de toi que personne ne peut reproduire.',
  },
];

export const products = PRODUCTS;
export const letterChapters = LETTER_CHAPTERS;

export const LETTER_PARAGRAPHS = [
  'Avec Sold Out, chaque collection est une paragraphe de la lettre, et la lettre est adressée aux personnes qui affirment leur identité.',
  'Chaque pièce porte une partie de la lettre, et la collection une lettre entière adressée à celles et ceux qui refusent de suivre la foule !',
];

export const MARQUEE_ITEMS = [
  'Uniqueness is identity',
  'Détermine ton unicité',
  'Drop 01 — The Letter',
  'Livraison mondiale',
];

export const HOW_IT_WORKS = [
  {
    no: '01',
    title: 'Choisis ta lettre',
    body: 'Parcours les quatre pièces, sélectionne ta taille et ajoute au panier.',
  },
  {
    no: '02',
    title: 'Envoie ton empreinte',
    body: 'Une photo nette de ton doigt pour chaque pièce. C’est elle qui sera imprimée.',
  },
  {
    no: '03',
    title: 'Confirme sur WhatsApp',
    body: 'Le récapitulatif part sur notre ligne avec tes fichiers. On te répond avec le délai.',
  },
];

export function formatPrice(amount: number): string {
  const formatter = new Intl.NumberFormat('fr-FR', { useGrouping: true });
  return `${formatter.format(amount)} FCFA`;
}
