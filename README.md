# Meu Audiobook

Player de audiobooks em formato de **web app** (React + Vite), com interface inspirada em um app Android nativo e navegação pensada para o celular.

> **Importante:** este projeto é uma **simulação interativa** (protótipo de interface). Os trechos de código Android exibidos dentro do app (Compose, Media3, Room) são ilustrativos e **não formam um projeto compilável**.

## Funcionalidades

- **Biblioteca** com capas, progresso de leitura e organização por autor;
- **Player** com capítulo atual, barra de progresso, avançar/voltar e controle de velocidade;
- **Timer de sono** com opções de tempo;
- **Favoritos e marcadores** por livro;
- **Estatísticas** de tempo ouvido;
- **Configurações** (tema, preferências de reprodução);
- **Simulação de notificação Android** e de varredura de pastas;
- **Explorador de código** do projeto Android de referência;
- Persistência local das preferências e do progresso.

## Tecnologias

| Camada | Stack |
|---|---|
| UI | React 19, Tailwind CSS 4, Lucide Icons, Motion |
| Build | Vite 8, TypeScript |
| Estado/armazenamento | Hooks + `localStorage` |

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

> O projeto usa React 19 com algumas dependências que ainda declaram React 18. Por isso há um `.npmrc` com `legacy-peer-deps=true` — sem ele o `npm install` falha.

## Build de produção

```bash
npm run build
```

O resultado fica em `dist/` e pode ser hospedado em qualquer serviço estático (Vercel, Netlify, GitHub Pages).

## Estrutura

```
src/
├── components/   modais, capas, moldura de celular, notificação
├── screens/      biblioteca, player, marcadores, estatísticas, ajustes
├── services/     áudio, armazenamento local
├── data/         livros de exemplo e fontes do projeto Android
└── types/        tipos do domínio
```

## Livros de exemplo

As obras usadas na demonstração são de **domínio público** (Machado de Assis).

## Release

Os artefatos de cada versão ficam na aba **Releases** deste repositório:

- `meu-audiobook-web-v*.zip` — site já compilado (basta servir os arquivos);
- `meu-audiobook-source-v*.zip` — código-fonte da versão.

## Aviso

Este repositório não é afiliado ao Google nem ao AI Studio. O projeto foi criado a partir de um protótipo gerado no AI Studio e reorganizado para publicação.
