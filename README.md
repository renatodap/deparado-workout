# Dani Fitness

App de treino personalizado para Daniela Dansieri - Clube Paulistano.

## Funcionalidades

- **Treinos Personalizados**: Plano de treino A/B/C para terça, quinta e sábado
- **Registro de Exercícios**: Acompanhe peso, repetições e séries
- **Timer de Descanso**: Timer inteligente entre séries
- **Histórico Completo**: Visualize todos os treinos realizados
- **Progresso e Estatísticas**: Gráficos de evolução e recordes pessoais
- **PWA**: Funciona offline e pode ser instalado no celular

## Stack Técnica

- React + TypeScript
- Tailwind CSS v4
- Vite
- LocalStorage para persistência
- PWA com Service Worker

## Instalação

```bash
npm install
npm run dev
```

## Build para Produção

```bash
npm run build
```

## Deploy

O projeto está configurado para deploy na Vercel. Basta conectar o repositório à Vercel para deploy automático.

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── hooks/          # Hooks personalizados
├── data/           # Dados de exercícios e treinos
├── types/          # Tipos TypeScript
├── App.tsx         # Componente principal
└── main.tsx        # Ponto de entrada
```

## Treinos Disponíveis

### Treino A (Terça-feira)
- Crucifixo Máquina
- Leg Press
- Abdominal Máquina
- Remada Máquina
- Extensora
- Rosca Bíceps

### Treino B (Quinta-feira)
- Desenvolvimento Máquina
- Flexora Sentada
- Rotação de Tronco
- Puxada Frontal
- Adutora/Abdutora
- Tríceps

### Treino C (Sábado - Opcional)
- Supino Máquina (leve)
- Leg Press (leve)
- Prancha
- Remada com Halter
- Panturrilha
- Elevação Lateral

---

Feito com amor para Daniela Dansieri.
