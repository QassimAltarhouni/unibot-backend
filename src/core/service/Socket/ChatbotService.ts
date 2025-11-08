import CategoryModel from '@/Model/category.model';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatbotService {
  chatbotName: string;
  chatbotId: string;
  private categories: any[] = [];
  private lastCategoryUpdate: number = 0;
  private categoryUpdateInterval: number = 5 * 60 * 1000; // 5 minutes
  private genAI: GoogleGenerativeAI;
  private conversationHistory: Map<
    string,
    Array<{ role: string; content: string }>
  > = new Map();
  private userLanguages: Map<string, string> = new Map(); // Track user language preferences

  constructor(chatbotName: string, chatbotId: string) {
    this.chatbotName = chatbotName;
    this.chatbotId = chatbotId;
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.loadCategories();
  }

  // Load categories from database
  private async loadCategories(): Promise<void> {
    try {
      this.categories = await CategoryModel.find({}).exec();
      this.lastCategoryUpdate = Date.now();
      console.log(`📚 Loaded ${this.categories.length} categories for ChatBot`);
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
  }

  // Check if categories need refresh
  private async refreshCategoriesIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCategoryUpdate > this.categoryUpdateInterval) {
      await this.loadCategories();
    }
  }

  // Set user language preference
  public setUserLanguage(userId: string, language: string): void {
    this.userLanguages.set(userId, language);
  }

  // Get user language preference
  private getUserLanguage(userId: string): string {
    return this.userLanguages.get(userId) || 'en';
  }

  // Get language-specific instructions
  private getLanguageInstructions(language: string): string {
    const instructions = {
      en: `
RESPONSE LANGUAGE: Respond ONLY in English.
CULTURAL CONTEXT: Use international/global context when appropriate.
TONE: Professional and helpful for academic environment.
FORMATTING: Use proper markdown formatting for better readability.`,

      pl: `
RESPONSE LANGUAGE: Odpowiadaj WYŁĄCZNIE w języku polskim.
KONTEKST KULTUROWY: Używaj polskiego kontekstu kulturowego i akademickiego.
TON: Profesjonalny ale przyjazny, odpowiedni dla środowiska uniwersyteckiego.
FORMATOWANIE: Używaj właściwego formatowania markdown dla lepszej czytelności.
UWAGI: Wszystkie odpowiedzi, nagłówki, i terminy techniczne muszą być w języku polskim.`,

      es: `
RESPONSE LANGUAGE: Responde ÚNICAMENTE en español.
CONTEXTO CULTURAL: Usa contexto cultural hispano cuando sea apropiado.
TONO: Profesional y servicial para ambiente académico.
FORMATEO: Usa formato markdown apropiado para mejor legibilidad.
NOTAS: Todas las respuestas, encabezados y términos técnicos deben estar en español.`,
    };

    return (
      instructions[language as keyof typeof instructions] || instructions.en
    );
  }

  // COMPLETELY DYNAMIC AI RESPONSE WITH LANGUAGE SUPPORT
  async getAIResponse(
    message: string,
    userId: string,
    userLanguage?: string
  ): Promise<string> {
    try {
      await this.refreshCategoriesIfNeeded();

      // Update user language if provided
      if (userLanguage) {
        this.setUserLanguage(userId, userLanguage);
      }

      const language = this.getUserLanguage(userId);

      // Get conversation history for this user
      const userHistory = this.conversationHistory.get(userId) || [];

      // Pass EVERYTHING to AI - let AI decide what to do
      const rawModel = process.env.GEMINI_MODEL?.trim();
      const fallbackModel = 'models/gemini-1.5-flash-latest';
      const configuredModel = rawModel && rawModel.length > 0 ? rawModel : fallbackModel;
      const modelName = configuredModel.startsWith('models/')
        ? configuredModel
        : `models/${configuredModel}`;

      const model = this.genAI.getGenerativeModel({
        model: modelName,
      });
      // Prepare complete category data for AI analysis
      const categoriesData = this.categories.map(cat => ({
        id: cat._id.toString(),
        title: cat.title,
        description: cat.description,
        data: cat.data,
        url: cat.url || null,
      }));

      const conversationContext =
        userHistory.length > 0
          ? `\n\nConversation History:\n${userHistory
              .map(msg => `${msg.role}: ${msg.content}`)
              .join('\n')}\n`
          : '';

      const languageInstructions = this.getLanguageInstructions(language);

      const systemPrompt = `You are UniBot, a professional AI assistant for Wrocław University of Science and Technology (WUST).

${conversationContext}

COMPLETE CATEGORY DATABASE:
${JSON.stringify(categoriesData, null, 2)}

${languageInstructions}

PERSONALITY & TONE:
- Professional but friendly university assistant
- Helpful and informative
- Use appropriate emojis sparingly
- Never childish or overly casual
- Maintain university-appropriate language
- Be respectful and educational

USER INTENT UNDERSTANDING:
- When users ask for specific information about a category, provide the FULL content from the database
- When users ask "what is X about" or "tell me about X" - they want comprehensive information
- When users ask "how can I apply" or "what are requirements" after discussing a specific topic, assume they mean that topic
- When users use pronouns like "it", "this", "that" - refer to the conversation history to understand what they mean
- Don't add unnecessary disclaimers if the content already includes appropriate notes
- Present information as it exists in the database, maintaining its original tone and completeness

CONTEXT AWARENESS RULES:
- Always check conversation history for context
- If user asks about "requirements", "how to apply", "eligibility" without specifying what for, check what was discussed recently
- If the last topic discussed was a scholarship/program, assume they're asking about that
- Use conversation context to provide relevant, specific answers

ETHICAL GUIDELINES:
- Never support or suggest illegal activities (like bribery)
- Always promote ethical behavior
- Redirect inappropriate requests to proper channels
- Maintain professional standards
- If content includes disclaimers, preserve them as-is without adding more

RESPONSE FORMAT RULES:
- For single category matches: Provide comprehensive markdown response using ALL the category data
- For multiple categories: ONLY use this JSON format:
  {"text": "Your explanation text", "type": "category_suggestions", "categories": [{"id": "id", "title": "Title", "description": "Brief desc"}]}
- For no matches: Provide direct helpful text response
- NEVER mix JSON with other text - return EITHER pure JSON OR pure markdown text
- NEVER include code blocks with JSON data in regular responses
- Filter out any nonsensical/invalid categories (like "HI HI" or garbled text)

CONTENT PRESENTATION RULES:
- Present database content fully and accurately
- Include all sections: description, data, tables, examples, etc.
- Format tables properly in markdown
- Preserve original humor, tone, and disclaimers from database
- Don't add extra warnings unless content is genuinely harmful

INSTRUCTIONS:
1. Analyze the user's message: "${message}"
2. Consider conversation history if available for context
3. Search through ALL category data to find relevant information
4. If user asks about "requirements", "eligibility", "how to apply" and conversation history shows a specific topic, assume they mean that topic
5. If you find 1 relevant category: Present the COMPLETE information from that category
6. If you find 2-3 relevant categories: Return JSON format with category suggestions
7. If no relevant categories: Provide general helpful guidance
8. Always filter out invalid categories with garbled content
9. When users ask for "information about X", provide the full database content for X
10. IMPORTANT: Respond in the user's preferred language (${language})

Current user query: "${message}"`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      let aiText = response.text();

      // Clean up the response - ensure it's either valid JSON or clean text
      aiText = this.cleanAIResponse(aiText);

      // Add to conversation history
      this.addToConversationHistory(userId, 'user', message);
      this.addToConversationHistory(userId, 'assistant', aiText);

      return aiText;
    } catch (error) {
      console.error('Error getting AI response:', error);
      const language = this.getUserLanguage(userId);

      const errorMessages = {
        en: "⚠️ I'm having trouble accessing my knowledge base right now. Please try again in a moment.",
        pl: '⚠️ Mam obecnie problem z dostępem do mojej bazy wiedzy. Spróbuj ponownie za chwilę.',
        es: '⚠️ Tengo problemas para acceder a mi base de conocimientos ahora. Inténtalo de nuevo en un momento.',
      };

      return (
        errorMessages[language as keyof typeof errorMessages] ||
        errorMessages.en
      );
    }
  }

  // Clean AI response to ensure proper format
  private cleanAIResponse(response: string): string {
    // Remove any markdown code blocks around JSON
    response = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Check if response is meant to be JSON
    if (response.includes('"type":') && response.includes('"text":')) {
      try {
        // Try to extract and validate JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.text && parsed.type) {
            return JSON.stringify(parsed);
          }
        }
      } catch (error) {
        console.log('Failed to clean JSON response, returning as text');
      }
    }

    // If not JSON or invalid JSON, return as clean text
    return response.trim();
  }

  // Add conversation memory methods with better context tracking
  private addToConversationHistory(
    userId: string,
    role: string,
    content: string
  ): void {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const history = this.conversationHistory.get(userId)!;

    // Clean content for better context (remove JSON formatting)
    let cleanContent = content;
    if (content.includes('"type":') && content.includes('"text":')) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.text) {
          cleanContent = parsed.text;
        }
      } catch (error) {
        // Use original content if parsing fails
      }
    }

    history.push({ role, content: cleanContent });

    // Keep only last 10 messages to prevent memory issues
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
  }

  // DYNAMIC welcome message based on actual categories and language
  welcomeMessage(userId: string, language?: string): Object {
    if (language) {
      this.setUserLanguage(userId, language);
    }

    const userLang = this.getUserLanguage(userId);
    let welcomeText = '';

    const welcomeMessages = {
      en: {
        greeting: '👋 **Welcome to UniBot!**',
        intro:
          "I'm your intelligent assistant for **Wrocław University of Science and Technology**.",
        topics: (count: number) =>
          `📚 I have information about **${count} topics** including:`,
        moreTopic: (remaining: number) => `• And ${remaining} more topics!`,
        question: '❓ **What would you like to know?**',
        loading:
          "🔄 I'm currently loading my knowledge base. Please try asking me something in a moment!",
      },
      pl: {
        greeting: '👋 **Witamy w UniBot!**',
        intro:
          'Jestem Twoim inteligentnym asystentem **Politechniki Wrocławskiej**.',
        topics: (count: number) =>
          `📚 Mam informacje o **${count} tematach** w tym:`,
        moreTopic: (remaining: number) => `• I ${remaining} więcej tematów!`,
        question: '❓ **O czym chciałbyś wiedzieć?**',
        loading:
          '🔄 Obecnie ładuję moją bazę wiedzy. Spróbuj zadać mi pytanie za chwilę!',
      },
      es: {
        greeting: '👋 **¡Bienvenido a UniBot!**',
        intro:
          'Soy tu asistente inteligente para la **Universidad de Ciencia y Tecnología de Wrocław**.',
        topics: (count: number) =>
          `📚 Tengo información sobre **${count} temas** incluyendo:`,
        moreTopic: (remaining: number) => `• ¡Y ${remaining} temas más!`,
        question: '❓ **¿Qué te gustaría saber?**',
        loading:
          '🔄 Actualmente estoy cargando mi base de conocimientos. ¡Intenta preguntarme algo en un momento!',
      },
    };

    const messages =
      welcomeMessages[userLang as keyof typeof welcomeMessages] ||
      welcomeMessages.en;

    if (this.categories.length > 0) {
      const categoryTitles = this.categories.map(cat => cat.title);
      welcomeText = `${messages.greeting}\n\n${messages.intro}\n\n${messages.topics(this.categories.length)}\n${categoryTitles
        .slice(0, 5)
        .map(title => `• ${title}`)
        .join('\n')}${
        this.categories.length > 5
          ? `\n${messages.moreTopic(this.categories.length - 5)}`
          : ''
      }\n\n${messages.question}`;
    } else {
      welcomeText = `${messages.greeting}\n\n${messages.intro}\n\n${messages.loading}\n\n${messages.question}`;
    }

    return {
      userId,
      text: welcomeText,
      username: this.chatbotName,
      botId: this.chatbotId,
      timestamp: Date.now(),
      type: 'bot',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  // Clear conversation history for user
  public clearConversationHistory(userId: string): void {
    this.conversationHistory.delete(userId);
    this.userLanguages.delete(userId);
  }

  // Enhanced response message with language support
  async responseMessage(
    userId: string,
    message: string,
    language?: string
  ): Promise<Object> {
    const response = await this.getAIResponse(message, userId, language);

    return {
      userId,
      text: response,
      username: this.chatbotName,
      botId: this.chatbotId,
      timestamp: Date.now(),
      type: 'bot',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      replyTo: message,
    };
  }

  // User message format
  userMessage(userId: string, message: string, username: string): Object {
    return {
      userId,
      text: message,
      username: username || 'Student',
      timestamp: Date.now(),
      type: 'user',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  // Method to manually refresh categories
  async forceRefreshCategories(): Promise<void> {
    await this.loadCategories();
  }

  // Get available categories info
  getCategoriesInfo(): { count: number; titles: string[] } {
    return {
      count: this.categories.length,
      titles: this.categories.map(cat => cat.title),
    };
  }

  // Get user's language preference
  public getUserLanguagePreference(userId: string): string {
    return this.getUserLanguage(userId);
  }
}
