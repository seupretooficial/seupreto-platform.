### Architecture: SeuPreto Platform

O sistema será construído com foco em escalabilidade para atender ao modelo SaaS (Software as a Service).

#### Estrutura de Pastas
- `/admin`: Frontend do painel administrativo geral.
- `/frontend`: Interface web para clientes e barbeiros.
- `/backend`: API e lógica de negócio.
- `/mobile`: Versão para aplicativos móveis.
- `/database`: Scripts e modelos do banco de dados.

#### Decisões Técnicas
- **Multi-tenancy**: Estrutura preparada para separar dados de diferentes barbearias.
- **API First**: O backend será independente, permitindo que site e app usem a mesma base.
- **Notificações**: Serviço centralizado para disparos de WhatsApp e E-mail.