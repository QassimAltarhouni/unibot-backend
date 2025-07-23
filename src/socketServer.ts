import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ChatbotService } from '@/Service/Socket/ChatbotService';
import GoogleStudioService from '@/Service/Socket/GoogleStudioService';
import CategoryModel from '@/Model/category.model';

export class SocketServer {
  private io: SocketIOServer;
  private chatbotService: ChatbotService;
  private userSessions: Map<
    string,
    { userId: string; username: string; sessionId: string }
  >;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.chatbotService = new ChatbotService('UniBot', 'bot_unibot_001');
    this.userSessions = new Map();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', socket => {
      console.log(`🔌 User connected: ${socket.id}`);

      // Handle user joining chatbot session
      socket.on(
        'join_chatbot',
        async (data: {
          userId: string;
          username?: string;
          language?: string;
        }) => {
          try {
            const { userId, username = 'Student', language } = data; // ADD language parameter
            const sessionId = socket.id;

            this.userSessions.set(sessionId, { userId, username, sessionId });

            const roomId = `chatbot_${userId}`;
            await socket.join(roomId);

            console.log(
              `👤 User ${username} (${userId}) joined chatbot room: ${roomId} with language: ${language || 'en'}`
            );

            // Set user language if provided - ADD THIS
            if (language) {
              this.chatbotService.setUserLanguage(userId, language);
            }

            // Send welcome message with language parameter - FIX THIS
            const welcomeMsg = this.chatbotService.welcomeMessage(
              userId,
              language
            );
            socket.emit('chatbot_message', welcomeMsg);

            const categoriesInfo = this.chatbotService.getCategoriesInfo();
            console.log(`📚 Categories available: ${categoriesInfo.count}`);

            socket.emit('chatbot_connected', {
              status: 'connected',
              roomId,
              message: 'Connected to UniBot successfully!',
              categoriesCount: categoriesInfo.count,
            });
          } catch (error) {
            console.error('Error in join_chatbot:', error);
            socket.emit('chatbot_error', {
              message: 'Failed to connect to chatbot',
            });
          }
        }
      );

      // Handle user messages to chatbot
      socket.on(
        'user_message',
        async (data: {
          message: string;
          userId: string;
          language?: string;
        }) => {
          try {
            const { message, userId, language } = data;
            const session = this.userSessions.get(socket.id);

            if (!session) {
              socket.emit('chatbot_error', {
                message: 'Session not found. Please reconnect.',
              });
              return;
            }

            // Create user message object - FIX: Add 'this.'
            const userMsg = this.chatbotService.userMessage(
              userId,
              message,
              session.username
            );

            // Send user message confirmation immediately
            socket.emit('message_sent', userMsg);

            // Show typing indicator
            socket.emit('bot_typing', { typing: true });

            // Get AI response with language context - FIX: Add 'this.'
            const response = await this.chatbotService.responseMessage(
              userId,
              message,
              language
            );

            // Send response after a delay to simulate thinking
            setTimeout(
              () => {
                socket.emit('chatbot_message', response);
                socket.emit('bot_typing', { typing: false });
              },
              1000 + Math.random() * 1000
            ); // Random delay between 1-2 seconds
          } catch (error) {
            console.error('Error processing user message:', error);
            socket.emit('bot_typing', { typing: false });
            socket.emit('chatbot_error', {
              message:
                'Sorry, I encountered an error processing your message. Please try again.',
            });
          }
        }
      );

      // Handle category selection - ENHANCED with summary and language support
      socket.on('category_selected', async data => {
        try {
          const { categoryId, categoryTitle, userId, username, language } =
            data; // ADD language

          console.log(
            `📋 Category selected: ${categoryTitle} (${categoryId}) in language: ${language || 'en'}`
          );

          socket.emit('bot_typing', { typing: true });

          // Find the specific category from database
          const category = await CategoryModel.findById(categoryId);

          if (category) {
            // Get user's current language preference
            const userLanguage =
              language ||
              this.chatbotService.getUserLanguagePreference(userId) ||
              'en';

            // Create language-specific summaries
            let summary = '';

            if (category.title.toLowerCase().includes('student id')) {
              // Language-specific Student ID summaries
              const studentIdSummaries = {
                en: `📋 **${category.title}**

**Quick Overview:**
The Electronic Student ID (ELS) is your official student document at WUST.

**📝 How to Apply:**
1. **Get the form** - Available at Dean's office
2. **Submit documents** - In person or email to dziekanat.wit@pwr.edu.pl  
3. **Pay fee** - Through web.usos.pwr.edu.pl
4. **Collect card** - Visit Dean's office after email notification

**💳 What it does:**
• Confirms your student status
• Works as library card
• Provides building access
• Functions as public transport card (URBANCARD)

**⚠️ Important:** Not needed for newly admitted 1st year students initially.

${category.url ? `🔗 **More details:** [Official page](${category.url})` : ''}

Need help with any specific step? Just ask! 😊`,

                pl: `📋 **${category.title}**

**Szybki przegląd:**
Elektroniczna Legitymacja Studencka (ELS) to Twój oficjalny dokument studencki na PWr.

**📝 Jak złożyć wniosek:**
1. **Pobierz formularz** - Dostępny w dziekanacie
2. **Złóż dokumenty** - Osobiście lub mailem na dziekanat.wit@pwr.edu.pl  
3. **Opłać składkę** - Przez web.usos.pwr.edu.pl
4. **Odbierz kartę** - Odwiedź dziekanat po otrzymaniu powiadomienia

**💳 Do czego służy:**
• Potwierdza status studenta
• Działa jako karta biblioteczna
• Zapewnia dostęp do budynków
• Funkcjonuje jako karta komunikacji miejskiej (URBANCARD)

**⚠️ Ważne:** Nie jest potrzebna dla nowo przyjętych studentów I roku początkowo.

${category.url ? `🔗 **Więcej szczegółów:** [Strona oficjalna](${category.url})` : ''}

Potrzebujesz pomocy z konkretnym krokiem? Po prostu zapytaj! 😊`,

                es: `📋 **${category.title}**

**Resumen rápido:**
La Tarjeta de Estudiante Electrónica (ELS) es tu documento oficial de estudiante en WUST.

**📝 Cómo solicitar:**
1. **Obtener el formulario** - Disponible en la oficina del decanato
2. **Enviar documentos** - En persona o por email a dziekanat.wit@pwr.edu.pl  
3. **Pagar la tarifa** - A través de web.usos.pwr.edu.pl
4. **Recoger la tarjeta** - Visita el decanato después de la notificación por email

**💳 Para qué sirve:**
• Confirma tu estatus de estudiante
• Funciona como tarjeta de biblioteca
• Proporciona acceso a edificios
• Funciona como tarjeta de transporte público (URBANCARD)

**⚠️ Importante:** No es necesaria para estudiantes de primer año recién admitidos inicialmente.

${category.url ? `🔗 **Más detalles:** [Página oficial](${category.url})` : ''}

¿Necesitas ayuda con algún paso específico? ¡Solo pregunta! 😊`,
              };

              summary =
                studentIdSummaries[
                  userLanguage as keyof typeof studentIdSummaries
                ] || studentIdSummaries.en;
            } else {
              // General category summary with language support
              const generalSummaries = {
                en: `📋 **${category.title}**

${category.description}

**Key Points:**
${this.extractKeyPoints(category.data)}

${category.url ? `🔗 **More information:** [Click here](${category.url})` : ''}`,

                pl: `📋 **${category.title}**

${category.description}

**Kluczowe punkty:**
${this.extractKeyPoints(category.data)}

${category.url ? `🔗 **Więcej informacji:** [Kliknij tutaj](${category.url})` : ''}`,

                es: `📋 **${category.title}**

${category.description}

**Puntos clave:**
${this.extractKeyPoints(category.data)}

${category.url ? `🔗 **Más información:** [Haz clic aquí](${category.url})` : ''}`,
              };

              summary =
                generalSummaries[
                  userLanguage as keyof typeof generalSummaries
                ] || generalSummaries.en;
            }

            const botResponse = {
              userId,
              text: summary,
              username: 'UniBot',
              botId: 'unibot_001',
              timestamp: Date.now(),
              type: 'bot',
              messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };

            socket.emit('bot_typing', { typing: false });
            socket.emit('chatbot_message', botResponse);
          } else {
            // Language-specific error messages
            const userLanguage =
              language ||
              this.chatbotService.getUserLanguagePreference(userId) ||
              'en';

            const errorMessages = {
              en: `❌ **Information Not Found**\n\nSorry, I couldn't find detailed information for "${categoryTitle}".\n\n💡 Please try asking about it in a different way or contact support.`,
              pl: `❌ **Informacja nie znaleziona**\n\nPrzepraszam, nie mogłem znaleźć szczegółowych informacji dla "${categoryTitle}".\n\n💡 Spróbuj zapytać o to w inny sposób lub skontaktuj się z pomocą techniczną.`,
              es: `❌ **Información no encontrada**\n\nLo siento, no pude encontrar información detallada para "${categoryTitle}".\n\n💡 Intenta preguntar de otra manera o contacta con soporte.`,
            };

            const errorResponse = {
              userId,
              text:
                errorMessages[userLanguage as keyof typeof errorMessages] ||
                errorMessages.en,
              username: 'UniBot',
              botId: 'unibot_001',
              timestamp: Date.now(),
              type: 'bot',
              messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };

            socket.emit('bot_typing', { typing: false });
            socket.emit('chatbot_message', errorResponse);
          }
        } catch (error) {
          console.error('Error handling category selection:', error);

          // Language-specific error messages - FIX: Get language from data parameter
          const userLanguage = data.language || 'en'; // FIX: Use data.language instead of just language
          const errorMessages = {
            en: `⚠️ **Error Loading Information**\n\nI encountered an error while loading the category information. Please try again or contact support.`,
            pl: `⚠️ **Błąd ładowania informacji**\n\nNapotkałem błąd podczas ładowania informacji o kategorii. Spróbuj ponownie lub skontaktuj się z pomocą techniczną.`,
            es: `⚠️ **Error cargando información**\n\nEncontré un error al cargar la información de la categoría. Inténtalo de nuevo o contacta con soporte.`,
          };

          const errorResponse = {
            userId: data.userId,
            text:
              errorMessages[userLanguage as keyof typeof errorMessages] ||
              errorMessages.en,
            username: 'UniBot',
            botId: 'unibot_001',
            timestamp: Date.now(),
            type: 'bot',
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };

          socket.emit('bot_typing', { typing: false });
          socket.emit('chatbot_message', errorResponse);
        }
      });

      // Handle category refresh request
      socket.on('refresh_categories', async () => {
        try {
          await this.chatbotService.forceRefreshCategories();
          const categoriesInfo = this.chatbotService.getCategoriesInfo();

          socket.emit('categories_refreshed', {
            count: categoriesInfo.count,
            titles: categoriesInfo.titles,
            message: `Categories refreshed! Now I have information about ${categoriesInfo.count} topics.`,
          });

          console.log(`🔄 Categories refreshed for user: ${socket.id}`);
        } catch (error) {
          console.error('Error refreshing categories:', error);
          socket.emit('chatbot_error', {
            message: 'Failed to refresh categories',
          });
        }
      });

      // Handle typing indicators from user
      socket.on('user_typing', (data: { typing: boolean; userId: string }) => {
        const { typing, userId } = data;
        const roomId = `chatbot_${userId}`;
        socket.to(roomId).emit('user_typing', { typing, userId });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const session = this.userSessions.get(socket.id);
        if (session) {
          console.log(
            `👤 User ${session.username} (${session.userId}) disconnected from chatbot`
          );
          this.userSessions.delete(socket.id);
        }
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });

      // Ping/Pong for connection health
      socket.on('ping', data => {
        socket.emit('pong', {
          ...data,
          serverTime: Date.now(),
          categoriesCount: this.chatbotService.getCategoriesInfo().count,
        });
      });

      // Handle language change
      socket.on('language_changed', async data => {
        const { userId, language } = data;

        try {
          // Update user language in ChatbotService - FIX: Add 'this.'
          this.chatbotService.setUserLanguage(userId, language);

          // Send a new welcome message in the selected language - FIX: Add 'this.'
          const welcomeMsg = this.chatbotService.welcomeMessage(
            userId,
            language
          );

          socket.emit('bot_typing', { typing: true });

          setTimeout(() => {
            socket.emit('chatbot_message', welcomeMsg);
            socket.emit('bot_typing', { typing: false });
          }, 1000);
        } catch (error) {
          console.error('Error handling language change:', error);
          socket.emit('chatbot_error', {
            message: 'Failed to change language',
          });
        }
      });
    });
  }

  // Method to broadcast category updates to all connected users
  public broadcastCategoryUpdate(): void {
    this.chatbotService.forceRefreshCategories().then(() => {
      const categoriesInfo = this.chatbotService.getCategoriesInfo();
      this.io.emit('categories_updated', {
        count: categoriesInfo.count,
        message: `Categories have been updated! I now have information about ${categoriesInfo.count} topics.`,
      });
      console.log(`📢 Broadcasted category update to all users`);
    });
  }

  // Method to broadcast system messages
  public broadcastSystemMessage(message: string): void {
    this.io.emit('system_message', {
      text: message,
      timestamp: Date.now(),
      type: 'system',
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.userSessions.size;
  }

  // Helper method to extract key points
  private extractKeyPoints(data: string): string {
    const sentences = data.split(/[.\n]/);
    const keyPoints = sentences
      .filter(sentence => sentence.trim().length > 20)
      .slice(0, 4)
      .map(point => `• ${point.trim()}`)
      .join('\n');

    return keyPoints || '• See detailed information above';
  }
}
