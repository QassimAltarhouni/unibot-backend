import { ChatbotService } from '@/Service/Socket/ChatbotService';
import CategoryModel from '@/Model/category.model';

const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn(() => ({
  generateContent: mockGenerateContent,
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

jest.mock('@/Model/category.model', () => ({
  __esModule: true,
  default: { find: jest.fn() },
}));

const categories = [
  {
    _id: 'cat-1',
    title: 'Erasmus+ Scholarships',
    description: 'Study abroad funding for students',
    data: 'Applications open in March.',
    url: 'https://example.edu/erasmus',
  },
];

const mockCategoryFind = CategoryModel.find as unknown as jest.Mock;

/** Shape returned by @google/generative-ai's generateContent(). */
const geminiReply = (text: string) => ({
  response: Promise.resolve({ text: () => text }),
});

const lastPrompt = (): string =>
  mockGenerateContent.mock.calls[mockGenerateContent.mock.calls.length - 1][0];

const createService = async () => {
  const service = new ChatbotService('UniBot', 'bot-1');
  // The constructor starts loading categories; wait for it explicitly.
  await service.forceRefreshCategories();
  return service;
};

describe('ChatbotService', () => {
  let consoleSpies: jest.SpyInstance[] = [];

  beforeEach(() => {
    mockCategoryFind.mockReturnValue({
      exec: jest.fn().mockResolvedValue(categories),
    });
    // The service logs to the console; keep test output clean.
    consoleSpies = [
      jest.spyOn(console, 'log').mockImplementation(() => undefined),
      jest.spyOn(console, 'error').mockImplementation(() => undefined),
    ];
  });

  afterEach(() => {
    consoleSpies.forEach(spy => spy.mockRestore());
  });

  it('sends the question, category data and language to Gemini and returns the cleaned reply', async () => {
    mockGenerateContent.mockResolvedValue(
      geminiReply('  Erasmus+ applications open in March.  ')
    );
    const service = await createService();

    const reply = await service.getAIResponse(
      'How do I apply for Erasmus?',
      'user-1',
      'pl'
    );

    expect(reply).toBe('Erasmus+ applications open in March.');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const prompt = lastPrompt();
    expect(prompt).toContain('How do I apply for Erasmus?');
    expect(prompt).toContain('Erasmus+ Scholarships');
    expect(prompt).toContain('Odpowiadaj WYŁĄCZNIE w języku polskim');
    expect(service.getUserLanguagePreference('user-1')).toBe('pl');
  });

  it('includes earlier messages from the same user as conversation context', async () => {
    mockGenerateContent
      .mockResolvedValueOnce(geminiReply('Erasmus+ is a study abroad programme.'))
      .mockResolvedValueOnce(geminiReply('You apply through the faculty office.'));
    const service = await createService();

    await service.getAIResponse('What is Erasmus?', 'user-1');
    await service.getAIResponse('How can I apply for it?', 'user-1');

    const prompt = lastPrompt();
    expect(prompt).toContain('user: What is Erasmus?');
    expect(prompt).toContain('assistant: Erasmus+ is a study abroad programme.');
  });

  it('normalises a category-suggestion JSON reply wrapped in a code fence', async () => {
    const suggestion = {
      text: 'I found a few related topics:',
      type: 'category_suggestions',
      categories: [{ id: 'cat-1', title: 'Erasmus+ Scholarships' }],
    };
    mockGenerateContent.mockResolvedValue(
      geminiReply('```json\n' + JSON.stringify(suggestion, null, 2) + '\n```')
    );
    const service = await createService();

    const reply = await service.getAIResponse('scholarships', 'user-1');

    expect(JSON.parse(reply)).toEqual(suggestion);
  });

  it('returns a localised fallback message when Gemini fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('quota exceeded'));
    const service = await createService();

    const english = await service.getAIResponse('Hello', 'user-en');
    const polish = await service.getAIResponse('Cześć', 'user-pl', 'pl');

    expect(english).toBe(
      "⚠️ I'm having trouble accessing my knowledge base right now. Please try again in a moment."
    );
    expect(polish).toBe(
      '⚠️ Mam obecnie problem z dostępem do mojej bazy wiedzy. Spróbuj ponownie za chwilę.'
    );
  });

  it('wraps the AI reply in a bot message for the socket layer', async () => {
    mockGenerateContent.mockResolvedValue(geminiReply('Hi there!'));
    const service = await createService();

    const message = await service.responseMessage('user-1', 'Hello');

    expect(message).toMatchObject({
      userId: 'user-1',
      text: 'Hi there!',
      username: 'UniBot',
      botId: 'bot-1',
      type: 'bot',
      replyTo: 'Hello',
    });
  });
});
