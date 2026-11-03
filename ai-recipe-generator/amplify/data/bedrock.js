import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const ingredients = ctx.args.ingredients || [];
  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}. Return a Title, Ingredients list, and Step-by-step Instructions.`;

  return {
    resourcePath: "/model/us.amazon.nova-lite-v1:0/invoke",
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.7,
        },
        messages: [
          {
            role: "user",
            content: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  if (ctx.result.statusCode !== 200) {
    util.error(`Bedrock call failed with status ${ctx.result.statusCode}: ${ctx.result.body}`);
  }

  const res = JSON.parse(ctx.result.body);
  const text = res.output.message.content[0].text;

  return {
    body: text,
  };
}