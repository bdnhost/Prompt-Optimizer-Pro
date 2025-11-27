export const META_PROMPT_TEMPLATE = `
{$PROMPT}
{$EVALUATION_CRITERIA}
</Inputs>

<Instructions Structure>
I will structure the instructions as follows:
1. Start with a clear explanation of the task - the AI will be optimizing prompts
2. Present the input variables early:
   - First, the evaluation criteria (if provided) that define what makes a good prompt
   - Then, the prompt to be optimized
3. Provide detailed instructions on the optimization methodology:
   - Analyze the current prompt's strengths and weaknesses
   - Apply systematic optimization techniques
   - Generate an improved version
4. Specify the output format with XML tags for organization
5. Include scratchpad for thinking through the analysis before providing the final optimized prompt
</Instructions Structure>

<Instructions>
You will be optimizing a prompt to make it more effective, clear, and likely to produce high-quality results from an AI assistant. Your goal is to apply modern prompt engineering techniques to improve the given prompt.

Here are the evaluation criteria for what makes a good prompt (if specific criteria are not provided, use general best practices):
<evaluation_criteria>
{$EVALUATION_CRITERIA}
</evaluation_criteria>

Here is the prompt to optimize:
<prompt>
{$PROMPT}
</prompt>

Your task is to analyze and optimize this prompt using the following methodology:

1. **Analysis Phase**: Examine the current prompt for:
   - Clarity and specificity of instructions
   - Presence of examples or context
   - Appropriate structure and formatting
   - Potential ambiguities or missing information
   - Whether it follows prompt engineering best practices

2. **Optimization Techniques**: Apply relevant techniques such as:
   - Adding clear role definitions (e.g., "You are an expert...")
   - Breaking complex tasks into step-by-step instructions
   - Including relevant examples or templates
   - Specifying output format with XML tags or structured formatting
   - Adding constraints or guardrails where appropriate
   - Incorporating chain-of-thought reasoning when beneficial
   - Making implicit requirements explicit
   - Removing redundancy while maintaining clarity
   - Ensuring the prompt is self-contained and unambiguous

3. **Quality Checks**: Ensure the optimized prompt:
   - Is more likely to produce consistent, high-quality outputs
   - Reduces potential for misinterpretation
   - Maintains or improves upon the original intent
   - Follows the evaluation criteria provided

Please structure your response as follows:

First, use a scratchpad to think through your analysis:
<scratchpad>
- Identify the main weaknesses and areas for improvement in the current prompt
- Note which optimization techniques would be most beneficial
- Consider how to maintain the original intent while improving clarity and effectiveness
</scratchpad>

Then provide your analysis:
<analysis>
Explain what issues you identified with the original prompt and what optimization strategies you plan to apply. Discuss how these changes will improve the prompt's effectiveness.
</analysis>

Finally, provide the optimized prompt:
<optimized_prompt>
Write the complete optimized version of the prompt here. This should be a ready-to-use prompt that incorporates all your improvements.
</optimized_prompt>

<key_improvements>
Summarize the 3-5 most important changes you made and why they matter.
</key_improvements>
</Instructions>`;

export const DEFAULT_CRITERIA = "Clarity, specificity, structural organization, and inclusion of examples where helpful.";
