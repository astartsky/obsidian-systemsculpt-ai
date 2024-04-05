import { TasksModule } from '../TasksModule';

export async function generateTask(
  plugin: TasksModule,
  taskDescription: string
): Promise<string> {
  const prompt = buildTaskPrompt(
    taskDescription,
    plugin.settings.defaultTaskPrompt
  );

  const modelId =
    plugin.plugin.brainModule.settings.defaultOpenAIModelId || 'gpt-3.5-turbo';

  // Retrieve the maxTokens setting from the brainModule settings
  const temperature = plugin.plugin.brainModule.settings.temperature || 0.5; // Assuming a default value if not set
  const maxTokens = plugin.plugin.brainModule.settings.maxTokens || 2048; // Assuming a default value if not set

  try {
    const apiService = plugin.plugin.brainModule.openAIService;
    return await apiService.createChatCompletion(
      prompt,
      modelId,
      temperature,
      maxTokens
    );
  } catch (error) {
    console.error('Error generating task:', error);
    throw new Error(
      'Failed to generate task. Please check your API key and try again.'
    );
  }
}

function buildTaskPrompt(
  taskDescription: string,
  promptTemplate: string
): string {
  return promptTemplate.replace('{task}', taskDescription);
}