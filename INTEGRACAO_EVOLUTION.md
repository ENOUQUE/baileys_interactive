# Integração com Evolution API

Este projeto foi integrado com a Evolution API para gerenciar instâncias WhatsApp de forma mais robusta.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=8787
API_KEY=sua_api_key_aqui
AUTH_FOLDER=auth
EVOLUTION_API_PATH=../../ap.api/evolution-api
```

**Importante**: Ajuste o caminho `EVOLUTION_API_PATH` conforme a localização da Evolution API no seu sistema.

### 2. Instalação de Dependências

Execute:

```bash
npm install
```

### 3. Configuração da Evolution API

Certifique-se de que a Evolution API está configurada e funcionando. Você pode precisar:

- Configurar o banco de dados (PostgreSQL/MySQL)
- Configurar Redis (opcional, para cache)
- Executar as migrações do Prisma

## Como Funciona

O projeto agora usa a Evolution API como backend através de um adaptador (`src/services/evolution-adapter.ts`) que:

1. **Mantém compatibilidade**: Todas as rotas existentes continuam funcionando da mesma forma
2. **Usa Evolution API**: Por baixo dos panos, usa os serviços da Evolution API para gerenciar instâncias e enviar mensagens
3. **Interface unificada**: A mesma interface de API é mantida, facilitando a migração

## Rotas Disponíveis

Todas as rotas existentes continuam funcionando:

### Instâncias
- `POST /v1/instances` - Criar/conectar instância
- `GET /v1/instances` - Listar instâncias
- `GET /v1/instances/:name` - Status de uma instância
- `GET /v1/instances/:name/qr` - Obter QR code
- `POST /v1/instances/:name/disconnect` - Desconectar
- `POST /v1/instances/:name/logout` - Logout e remover sessão
- `DELETE /v1/instances/:name` - Remover instância

### Mensagens
- `POST /v1/messages/send_menu` - Menu texto
- `POST /v1/messages/send_buttons_helpers` - Botões quick reply
- `POST /v1/messages/send_interactive_helpers` - Botões CTA (URL, Copiar, Ligar)
- `POST /v1/messages/send_list_helpers` - Lista dropdown
- `POST /v1/messages/send_poll` - Enquete
- `POST /v1/messages/send_carousel_helpers` - Carrossel

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Notas Importantes

1. **Caminho da Evolution API**: Certifique-se de que o caminho `EVOLUTION_API_PATH` está correto no `.env`
2. **Banco de Dados**: A Evolution API requer um banco de dados configurado. Consulte a documentação da Evolution API para mais detalhes
3. **Compatibilidade**: O adaptador tenta usar a Evolution API diretamente. Se houver problemas, verifique os logs

## Troubleshooting

### Erro: "Evolution API não encontrada"
- Verifique se o caminho `EVOLUTION_API_PATH` está correto
- Certifique-se de que a Evolution API está no caminho especificado

### Erro ao criar instância
- Verifique se a Evolution API está configurada corretamente
- Verifique os logs da Evolution API
- Certifique-se de que o banco de dados está configurado

### Mensagens não são enviadas
- Verifique se a instância está conectada (`status: 'connected'`)
- Verifique os logs para erros específicos
- Certifique-se de que os formatos de mensagem estão corretos

## Suporte

Para problemas relacionados à Evolution API, consulte a documentação oficial: https://github.com/EvolutionAPI/evolution-api
